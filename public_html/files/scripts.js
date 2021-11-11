class Mancala {
  constructor() {
    this.storeOpponent = 0;
    this.pitsPlayer = new Array(1);
    this.pitsOpponent = new Array(1);
    this.storePlayer = 0;
    this.difficultyAI = 0;
    this.turn = "";
  }

  updateMancala(
    storeOpponentStatus,
    pitsPlayerStatus,
    pitsOpponentStatus,
    storePlayerStatus,
    difficultyAI,
    gameStarter
  ) {
    this.storeOpponent = storeOpponentStatus;
    this.pitsPlayer = pitsPlayerStatus;
    this.pitsOpponent = pitsOpponentStatus;
    this.storePlayer = storePlayerStatus;
    this.difficultyAI = difficultyAI;
    this.turn = gameStarter;
  }

  gamePlay(event) {
    const element = ((event) => {
      if (event.path[0].classList.value == "seed") {
        return event.path[0].parentElement;
      } else {
        return event.srcElement;
      }
    })(event);
    console.log(event);
    console.log(element);

    const pit = parseInt(element.id.slice(-1));

    console.log(pit);

    const seedsInPit = game.pitsPlayer[pit - 1];
    game.pitsPlayer[pit - 1] = 0;

    console.log(seedsInPit);
    let lastPlayed;
    const middle = game.pitsPlayer.length + 1;
    for (let i = 1; i <= seedsInPit; i++) {
      const currentPosition = pit + i;
      const relativePosition =
        currentPosition % (game.pitsPlayer.length * 2 + 1);

      if (relativePosition == middle) {
        game.storePlayer++;
        lastPlayed = ("storePlayer", currentPosition);
      } else {
        if (relativePosition > middle || relativePosition == 0) {
          const abc = ((x) => {
            if (x == 0) {
              return game.pitsPlayer.length * 2 + 1;
            } else {
              return x;
            }
          })(relativePosition);
          game.pitsOpponent[abc - middle - 1]++;
        } else {
          if (game.pitsPlayer[relativePosition - 1] == 0) {
            lastPlayed = ("emptyPitPlayer", currentPosition);
            game.storePlayer++;
            game.storePlayer +=
              game.pitsOpponent[middle - relativePosition - 1];
            game.pitsOpponent[middle - relativePosition - 1] = 0;
          } else {
            game.pitsPlayer[relativePosition - 1]++;
          }
        }
      }
    }
    console.log(game);
    game.opponentTurn();
  }

  opponentTurn() {
    console.log(this);
    console.log("ThisIsTheOpponent'sTurn");
  }
}

const game = new Mancala();

function toggleElementDisplayOpen(elementId, openOrDisplay) {
  const x = document.getElementById(elementId);
  x.classList.toggle(openOrDisplay);
}

function startGame() {
  const numberOfPits = parseInt(
    document.querySelector('input[name="settingsPitsRadio"]:checked').value
  );
  const initialSeedNumber = parseInt(
    document.querySelector('input[name="numberSeeds"]').value
  );
  const difficultyAI = parseInt(
    document.querySelector('select[name="difficultySelector"]').value
  );
  const gameStarter = ((starter) => {
    if (starter == "gameStartedByPlayer") {
      return "Player";
    } else {
      return "Opponent";
    }
  })(
    document.querySelector('input[name="settingsFirstTurnRadio"]:checked').value
  );
  const returnObject = drawBoard(
    "gameBoard",
    numberOfPits,
    initialSeedNumber,
    gameStarter
  );
  game.updateMancala(
    returnObject.storeOpponentStatus,
    returnObject.pitsPlayerStatus,
    returnObject.pitsOpponentStatus,
    returnObject.storePlayerStatus,
    difficultyAI,
    gameStarter
  );
  toggleElementDisplayOpen("tabGameSettings", "open");
}

function drawBoard(parentId, numberOfPits, initialSeedNumber) {
  const parent = document.getElementById(parentId);

  const pitsPlayerStatus = new Array(numberOfPits);
  const pitsOpponentStatus = new Array(numberOfPits);
  const storePlayerStatus = 0;
  const storeOpponentStatus = 0;

  const storeOpponent = document.createElement("div");
  storeOpponent.className = "storeOpponent";
  parent.appendChild(storeOpponent);

  const gamePits = document.createElement("div");
  gamePits.className = "gamePits";
  parent.appendChild(gamePits);

  const gamePitsOpponent = document.createElement("div");
  gamePitsOpponent.className = "gamePitsOpponent";
  gamePits.appendChild(gamePitsOpponent);

  const gamePitsPlayer = document.createElement("div");
  gamePitsPlayer.className = "gamePitsPlayer";
  gamePits.appendChild(gamePitsPlayer);

  const storePlayer = document.createElement("div");
  storePlayer.className = "storePlayer";
  parent.appendChild(storePlayer);

  for (let i = 0; i < numberOfPits; i++) {
    pitsPlayerStatus[i] = initialSeedNumber;
    pitsOpponentStatus[i] = initialSeedNumber;

    const pitPlayer = createPit("Player", i);
    gamePitsPlayer.appendChild(pitPlayer);

    const pitOpponent = createPit("Opponent", i);
    gamePitsOpponent.appendChild(pitOpponent);

    for (let j = 0; j < initialSeedNumber; j++) {
      pitPlayer.appendChild(createSeed());

      pitOpponent.appendChild(createSeed());
    }
  }

  const returnObject = {
    storeOpponentStatus: storeOpponentStatus,
    pitsPlayerStatus: pitsPlayerStatus,
    pitsOpponentStatus: pitsOpponentStatus,
    storePlayerStatus: storePlayerStatus,
  };

  return returnObject;
}

function createPit(playerOrOpponent, i) {
  const pit = document.createElement("div");
  pit.id = "pit" + playerOrOpponent + (i + 1);
  pit.className = "pit" + playerOrOpponent;
  if (playerOrOpponent == "Player") {
    pit.addEventListener("click", game.gamePlay);
  }

  return pit;
}

function createSeed() {
  const seed = document.createElement("div");
  seed.className = "seed";
  const x = Math.floor(Math.random() * 25) + 10;
  const y = Math.floor(Math.random() * 25) + 10;
  seed.style.left = x + "%";
  seed.style.top = y + "%";
  return seed;
}