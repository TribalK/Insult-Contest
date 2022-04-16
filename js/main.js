class CreateRoaster {
  constructor(name) {
    this.name = name;
    this.popularity = 60;
  }

  decreasePopularity() {
    const randNum = Math.floor(Math.random() * 5);
    this.popularity -= randNum;
  }

  isPopular() {
    return this.popularity > 0;
  }

  getName() {
    return this.name;
  }

  getPopularity() {
    return this.popularity;
  }

  getImageStatus() {
      switch(true) {
        case (this.popularity >= 41): {
          return 'HIGH';
          break;
        }
        case (this.popularity >= 21 && this.popularity < 41): {
          return 'MID';
          break;
        }
        case (this.popularity >= 1 && this.popularity < 21): {
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
  document.querySelector('.playerOne h4').innerText = `Popularity: ${playerOne.getPopularity()}`;
  document.querySelector('.playerTwo h4').innerText = `Popularity: ${playerTwo.getPopularity()}`;
  runRoastMatch(playerOne, playerTwo);
}

function createPlayerObject(pName) {
  let player = new CreateRoaster(pName);

  return player;
}

function runRoastMatch(playerOne, playerTwo) {
  let switchTurns = Math.random() > 0.5 ? true : false;

  let curInterval = setInterval(async function() {
    if(switchTurns) {
      const insult = await fetchInsult();
      let li = document.createElement('li');
      li.textContent = insult.insult;

      playerOne.decreasePopularity();
      const stat = playerOne.getImageStatus();
      document.querySelector('.playerOne img').src = `img/${stat}.JPG`;
      document.querySelector('.playerOne h4').innerText = `Popularity: ${playerOne.getPopularity()}`;
      document.querySelector('.playerTwo ul').appendChild(li);

    }
    else {
      const insult = await fetchInsult();
      let li = document.createElement('li');
      li.textContent = insult.insult;

      playerTwo.decreasePopularity();
      const stat = playerTwo.getImageStatus();
      document.querySelector('.playerTwo img').src = `img/${stat}.JPG`;
      document.querySelector('.playerTwo h4').innerText = `Popularity: ${playerTwo.getPopularity()}`;
      document.querySelector('.playerOne ul').appendChild(li);

    }
    switchTurns = !switchTurns;

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
    const playerName = playerOne.getName();
    document.querySelector('h2').innerText = `${playerOne.getName()} wins!`;
  } else {
    document.querySelector('h2').innerText = `${playerTwo.getName()} wins!`;
  }
}
