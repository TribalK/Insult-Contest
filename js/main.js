/* Two Class objects are made as Player 1 and Player 2 */
class CreateRoaster {
  constructor(name) {
    this._name = name;
    this._popularity = 60;
  }

  /* Each insult decreases the opponent's popularity */
  decreasePopularity() {
    const randNum = Math.floor(Math.random() * 15);
    this._popularity -= randNum;

    if(this._popularity < 0) {
      this._popularity = 0;
    }
  }

  /* Determines if game continues */
  isPopular() {
    return this._popularity > 0;
  }

  /* Getters */
  get name() {
    return this._name;
  }

  get popularity() {
    return this._popularity;
  }

  getImageStatus() {
      switch(true) {
        case (this._popularity >= 41): {
          return 'HIGH';
          break;
        }
        case (this._popularity >= 21 && this._popularity < 41): {
          return 'MID';
          break;
        }
        case (this._popularity >= 1 && this._popularity < 21): {
          return 'LOW';
          break;
        }
        default: {
          return 'ZERO';
          break;
        }
      }
  }
};

document.querySelector('#StartGame').addEventListener('click', switchPageLayout);

function switchPageLayout() {
  let gamePage = document.querySelector('.game-page');
  let startPage = document.querySelector('.start-screen');
  const playerOneName = document.getElementById('playerOneName').value;
  const playerTwoName = document.getElementById('playerTwoName').value;

  startPage.classList.toggle('hidden');
  gamePage.classList.toggle('hidden');

  let playerOne = createPlayerObject(playerOneName);
  let playerTwo = createPlayerObject(playerTwoName);

  const stat1 = playerOne.getImageStatus();
  const stat2 = playerTwo.getImageStatus();

  document.querySelector('.playerOne img').src = `img/${stat1}.JPG`;
  document.querySelector('.playerTwo img').src = `img/${stat2}.JPG`;
  document.querySelector('.playerOne h3').innerText = playerOneName;
  document.querySelector('.playerTwo h3').innerText = playerTwoName;
  document.querySelector('.playerOne h4').innerText = `Popularity: ${playerOne.popularity}`;
  document.querySelector('.playerTwo h4').innerText = `Popularity: ${playerTwo.popularity}`;
  runRoastMatch(playerOne, playerTwo);
}

function createPlayerObject(pName) {
  let player = new CreateRoaster(pName);

  return player;
}

/*
  function runRoastMatch

  params: playerOne object of CreateRoaster class,
          playerTwo object of CreateRoaster class

  description: creating a back-and-forth insult match that will pull
               data from an API and cause the opposing player to lose
               popularity until one player's popularity hits zero.
*/
function runRoastMatch(playerOne, playerTwo) {
  //randomize who starts first
  let switchTurns = Math.random() > 0.5 ? true : false;

  // run process on a 6 second timer =>
  // we need to async this function to wait for one
  // process to end before we generate the next process
  let curInterval = setInterval(async function() {
    if(switchTurns) {
      //Player Two insults Player One
      const insult = await fetchInsult();
      let li = document.createElement('li');
      li.textContent = insult.insult;

      //make visual display changes
      playerOne.decreasePopularity();
      const stat = playerOne.getImageStatus();
      document.querySelector('.playerOne img').src = `img/${stat}.JPG`;
      document.querySelector('.playerOne h4').innerText = `Popularity: ${playerOne.popularity}`;
      document.querySelector('.playerTwo ul').appendChild(li);

    }
    else {
      //Player One insults Player Two
      const insult = await fetchInsult();
      let li = document.createElement('li');
      li.textContent = insult.insult;

      //make visual display changes
      playerTwo.decreasePopularity();
      const stat = playerTwo.getImageStatus();
      document.querySelector('.playerTwo img').src = `img/${stat}.JPG`;
      document.querySelector('.playerTwo h4').innerText = `Popularity: ${playerTwo.popularity}`;
      document.querySelector('.playerOne ul').appendChild(li);

    }
    //Switch who starts the next turn
    switchTurns = !switchTurns;

    //Check if a player has lost
    if(!playerOne.isPopular() || !playerTwo.isPopular()) {
      clearInterval(curInterval);
      displayWinner(playerOne, playerTwo);
    }
  },6000);
}

async function fetchInsult() {
  const encodedURL = encodeURIComponent("https://evilinsult.com/generate_insult.php?lang=en&type=json");
  let fullURLAvoidCROS = `https://gtfo-cors--timmy_i_chen.repl.co/get?url=${encodedURL}`;

  return fetch(fullURLAvoidCROS)
  .then(res => {
    return res.json();
  })
}

function displayWinner(playerOne, playerTwo) {
  if(playerOne.isPopular()) {
    document.querySelector('h2').innerText = `${playerOne.name} wins!`;
  } else {
    document.querySelector('h2').innerText = `${playerTwo.name} wins!`;
  }
}
