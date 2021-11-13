// to do
//

("use strict");

class Mancala {
  constructor() {
    this.storeOpponent = 0;
    this.pits = new Array(1);
    this.storePlayer = 0;
    this.difficultyAI = 0;
    this.turn = "";
  }

  updateMancala(
    storeOpponentStatus,
    pitsStatus,
    storePlayerStatus,
    difficultyAI,
    gameStarter
  ) {
    this.storeOpponent = storeOpponentStatus;
    this.pits = pitsStatus;
    this.storePlayer = storePlayerStatus;
    this.difficultyAI = difficultyAI;
    this.turn = gameStarter;
  }

  gamePlayerPlay(event) {
    if (game.turn == "Opponent") {
      replaceGameMessages(
        "It's not your turn. Please allow the Opponent to finish his play."
      );
    } else {
      const element = ((x) => {
        if (x.path[0].classList.value == "seed") {
          return x.path[0].parentElement;
        } else {
          return x.srcElement;
        }
      })(event);
      console.log(event);
      console.log(element);
      console.log("logging"+this);

      const pit = parseInt(element.id.slice(-1));

      console.log(pit);

      const seedsInPit = game.pits[pit];
      if (seedsInPit == 0) {
        replaceGameMessages(
          "You can't select an empty pit to play. Please play again."
        );
      } else {
        game.gameMove(seedsInPit, pit);
        /*game.pits[pit] = 0;

        console.log(seedsInPit);
        let lastPlayed = {
          event: "",
          eventPosition: 0,
          eventRelativePosition: 0,
          lastPosition: 0,
        };
        const middle = game.pits.length / 2;
        for (let i = 1; i <= seedsInPit; i++) {
          const currentPosition = pit + i;
          const relativePosition = currentPosition % (game.pits.length + 1);
          console.log(relativePosition);
          if (relativePosition == middle) {
            game.storePlayer++;
            lastPlayed.event = "storePlayer";
            lastPlayed.eventPosition = currentPosition;
            lastPlayed.eventRelativePosition = relativePosition;
          } else {
            if (relativePosition > middle) {
              game.pits[relativePosition - 1]++;
            } else {
              if (game.pits[relativePosition] == 0) {
                lastPlayed.event = "emptyPitPlayer";
                lastPlayed.eventPosition = currentPosition;
                lastPlayed.eventRelativePosition = relativePosition;
              }
              game.pits[relativePosition]++;
            }
          }
          lastPlayed.lastPosition = currentPosition;
        }

        if (
          lastPlayed.eventPosition == lastPlayed.lastPosition &&
          lastPlayed.event == "storePlayer"
        ) {
          replaceGameMessages("The Player may play again");
          updateDisplay();
        } else {
          if (
            lastPlayed.event == "emptyPitPlayer" &&
            lastPlayed.eventPosition == lastPlayed.lastPosition
          ) {
            game.storePlayer++;
            game.storePlayer +=
              game.pits[middle + middle - lastPlayed.eventRelativePosition - 1];
            game.pits[
              middle + middle - lastPlayed.eventRelativePosition - 1
            ] = 0;
            game.pits[lastPlayed.eventRelativePosition] = 0;
          }
          game.turn = "Opponent";
          replaceGameMessages(
            "It is now the " + game.turn + "'s turn to play."
          );
          updateDisplay();
          game.opponentTurn();
        }*/
      }
    }
  }

  gameMove(seedsInPit, pit) {
    console.log(seedsInPit);

    let lastPlayed = {
      event: "",
      eventPosition: 0,
      eventRelativePosition: 0,
      lastPosition: 0,
    };
    const middle = this.pits.length / 2;
    const offset = ((x) => {
      if (x == "Player") {
        return 0;
      } else {
        return middle;
      }
    })(this.turn);

    this.pits[pit + offset] = 0;

    for (let i = 1; i <= seedsInPit; i++) {
      const currentPosition = pit + i;
      const relativePosition =
        (currentPosition + offset) % (this.pits.length + 1);
      console.log(relativePosition);

      if (relativePosition == middle && offset == 0) {
        this.storePlayer++;
        lastPlayed.event = "storePlayer";
        lastPlayed.eventPosition = currentPosition + offset;
        lastPlayed.eventRelativePosition = relativePosition;
      } else {
        if (relativePosition == 0 && offset == middle) {
          this.storeOpponent++;
          lastPlayed.event = "storeOpponent";
          lastPlayed.eventPosition = currentPosition + offset;
          lastPlayed.eventRelativePosition = relativePosition;
        } else {
          if (
            (offset == 0 && relativePosition > middle) ||
            (offset == middle && relativePosition <= middle)
          ) {
            this.pits[relativePosition - 1]++;
          } else {
            if (
              offset == 0 &&
              this.pits[relativePosition] == 0 &&
              relativePosition < middle
            ) {
              lastPlayed.event = "emptyPitPlayer";
              lastPlayed.eventPosition = currentPosition + offset;
              lastPlayed.eventRelativePosition = relativePosition;
            }
            if (
              offset == middle &&
              this.pits[relativePosition] == 0 &&
              relativePosition > middle
            ) {
              lastPlayed.event = "emptyPitOpponent";
              lastPlayed.eventPosition = currentPosition + offset;
              lastPlayed.eventRelativePosition = relativePosition;
            }
            this.pits[relativePosition]++;
          }
        }
      }
      lastPlayed.lastPosition = currentPosition + offset;
    }

    if (
      lastPlayed.eventPosition == lastPlayed.lastPosition &&
      lastPlayed.event.includes("store")
    ) {
      replaceGameMessages("The " + this.turn + " may play again");
      updateDisplay();
      if (this.turn == "Opponent") {
        this.opponentTurn();
      }
    } else {
      if (
        lastPlayed.event.includes("empty") &&
        lastPlayed.eventPosition == lastPlayed.lastPosition
      ) {
        if (offset == 0) {
          this.storePlayer++;
          this.storePlayer +=
            this.pits[middle + middle - lastPlayed.eventRelativePosition - 1];
          this.pits[middle + middle - lastPlayed.eventRelativePosition - 1] = 0;
          this.pits[lastPlayed.eventRelativePosition] = 0;
        } else {
          this.storeOpponent++;
          this.storeOpponent +=
            this.pits[middle - (lastPlayed.eventRelativePosition - middle) - 1];
          this.pits[lastPlayed.eventRelativePosition - middle - 1] = 0;
          this.pits[lastPlayed.eventRelativePosition] = 0;
        }
      }
      if (offset == 0) {
        this.turn = "Opponent";
      } else {
        this.turn = "Player";
      }
      replaceGameMessages("It is now the " + this.turn + "'s turn to play.");
      updateDisplay();
      if (offset == 0) {
        this.opponentTurn();
      }
    }
  }

  opponentTurn() {
    console.log(this);
    console.log("ThisIsTheOpponent'sTurn");

    const middle = this.pits.length / 2;
    const seedsInPit = this.pits[middle];

    this.gameMove(seedsInPit, 0);
  }
}

window.addEventListener("load", function () {
  document
    .getElementById("authAreaButton")
    .addEventListener("click", toggleElementDisplayOpen);
  document
    .getElementById("selectionBarItemGameRules")
    .addEventListener("click", toggleElementDisplayOpen);
  document
    .getElementById("selectionBarItemGameScores")
    .addEventListener("click", toggleElementDisplayOpen);
  document
    .getElementById("selectionBarItemGameSettings")
    .addEventListener("click", toggleElementDisplayOpen);
  document
    .getElementById("tabGameRulesTableToggle")
    .addEventListener("click", toggleElementDisplayOpen);
  document
    .getElementById("tabGameRulesPiecesToggle")
    .addEventListener("click", toggleElementDisplayOpen);
  document
    .getElementById("tabGameRulesStartToggle")
    .addEventListener("click", toggleElementDisplayOpen);
  document
    .getElementById("tabGameRulesPlayToggle")
    .addEventListener("click", toggleElementDisplayOpen);
  document
    .getElementById("tabGameRulesSeedToggle")
    .addEventListener("click", toggleElementDisplayOpen);
  document
    .getElementById("tabGameRulesContinueSeedingToggle")
    .addEventListener("click", toggleElementDisplayOpen);
  document
    .getElementById("tabGameRulesLastContainerToggle")
    .addEventListener("click", toggleElementDisplayOpen);
  document
    .getElementById("tabGameRulesLastEmptyToggle")
    .addEventListener("click", toggleElementDisplayOpen);
  document
    .getElementById("tabGameRulesEndToggle")
    .addEventListener("click", toggleElementDisplayOpen);
  document
    .getElementById("settingsStartGameButton")
    .addEventListener("click", startGame);
});

const game = new Mancala();
let gamesWonByPlayer = 0;
let gamesWonByPC = 0;

function toggleElementDisplayOpen(event) {
  const x = event.srcElement;
  if (x.classList.contains("rulesList")) {
    const y = document.getElementById(x.id.replace("Toggle", ""));
    y.classList.toggle("display");
  } else {
    if (x.id == "settingsStartGameButton") {
      const y = document.getElementById("tabGameSettings");
      y.classList.toggle("open");
    } else {
      if (x.classList.contains("selectionBarItem")) {
        const y = document.getElementById(
          x.id.replace("selectionBarItem", "tab")
        );
        y.classList.toggle("open");
      } else {
        const y = document.getElementById(x.id.replace("Button", ""));
        x.classList.toggle("open");
        y.classList.toggle("open");
      }
    }
  }
}

function startGame(event) {
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
    "gameStatusBox",
    "playTable",
    numberOfPits,
    initialSeedNumber,
    gameStarter
  );
  game.updateMancala(
    returnObject.storeOpponentStatus,
    returnObject.pitsStatus,
    returnObject.storePlayerStatus,
    difficultyAI,
    gameStarter
  );
  updateDisplay();
  toggleElementDisplayOpen(event);
}

function drawBoard(
  boardId,
  statusId,
  playTableId,
  numberOfPits,
  initialSeedNumber,
  gameStarter
) {
  const parentBoard = document.getElementById(boardId);
  const parentStatus = document.getElementById(statusId);
  const parentTableId = document.getElementById(playTableId);

  const pitsBoardStatus = new Array(numberOfPits * 2);
  const storePlayerBoardStatus = 0;
  const storeOpponentBoardStatus = 0;

  const storeOpponent = document.createElement("div");
  storeOpponent.classList.add("storeOpponent", "clickable");
  parentBoard.appendChild(storeOpponent);
  const storeOpponentStatus = document.createElement("div");
  storeOpponentStatus.className = "storeOpponentStatus";
  storeOpponentStatus.innerHTML = 0;
  parentStatus.appendChild(storeOpponentStatus);

  const gamePits = document.createElement("div");
  gamePits.className = "gamePits";
  parentBoard.appendChild(gamePits);
  const gamePitsStatus = document.createElement("div");
  gamePitsStatus.className = "gamePitsStatus";
  parentStatus.appendChild(gamePitsStatus);

  const gamePitsOpponent = document.createElement("div");
  gamePitsOpponent.className = "gamePitsOpponent";
  gamePits.appendChild(gamePitsOpponent);
  const gamePitsOpponentStatus = document.createElement("div");
  gamePitsOpponentStatus.className = "gamePitsOpponentStatus";
  gamePitsStatus.appendChild(gamePitsOpponentStatus);

  const gamePitsPlayer = document.createElement("div");
  gamePitsPlayer.className = "gamePitsPlayer";
  gamePits.appendChild(gamePitsPlayer);
  const gamePitsPlayerStatus = document.createElement("div");
  gamePitsPlayerStatus.className = "gamePitsPlayerStatus";
  gamePitsStatus.appendChild(gamePitsPlayerStatus);

  const storePlayer = document.createElement("div");
  storePlayer.classList.add("storePlayer", "clickable");
  parentBoard.appendChild(storePlayer);
  const storePlayerStatus = document.createElement("div");
  storePlayerStatus.className = "storePlayerStatus";
  storePlayerStatus.innerHTML = 0;
  parentStatus.appendChild(storePlayerStatus);

  for (let i = 0; i < numberOfPits; i++) {
    pitsBoardStatus[i] = initialSeedNumber;
    pitsBoardStatus[i + numberOfPits] = initialSeedNumber;

    const pitPlayer = createPit("Player", i);
    gamePitsPlayer.appendChild(pitPlayer);
    const pitPlayerStatus = createPit("PlayerStatus", i);
    pitPlayerStatus.innerHTML = initialSeedNumber;
    gamePitsPlayerStatus.appendChild(pitPlayerStatus);

    const pitOpponent = createPit("Opponent", i);
    gamePitsOpponent.appendChild(pitOpponent);
    const pitOpponentStatus = createPit("OpponentStatus", i);
    pitOpponentStatus.innerHTML = initialSeedNumber;
    gamePitsOpponentStatus.appendChild(pitOpponentStatus);
  }

  const gameMessages = document.createElement("div");
  gameMessages.id = "gameMessages";
  gameMessages.className = "gameMessages";
  gameMessages.innerHTML = "It is now the " + gameStarter + "'s turn to play.";
  parentTableId.appendChild(gameMessages);

  const forfeitButton = document.createElement("div");
  forfeitButton.classList.add("forfeitButton", "clickable");
  forfeitButton.addEventListener("click", forfeit);
  forfeitButton.innerHTML = "Forfeit";
  parentTableId.appendChild(forfeitButton);

  const returnObject = {
    storeOpponentStatus: storeOpponentBoardStatus,
    pitsStatus: pitsBoardStatus,
    storePlayerStatus: storePlayerBoardStatus,
  };

  parentBoard.style.borderStyle = "solid";

  return returnObject;
}

function createPit(playerOrOpponent, i) {
  const pit = document.createElement("div");
  pit.id = "pit" + playerOrOpponent + i;
  pit.classList.add("pit" + playerOrOpponent);
  if (!pit.id.includes("Status")) {
    pit.classList.add("clickable");
    pit.style.position = "relative";
  }
  if (playerOrOpponent == "Player") {
    pit.addEventListener("click", game.gamePlayerPlay);
  }

  return pit;
}

function createSeed(parent) {
  const seed = document.createElement("div");
  const parentBoundBox = parent.getBoundingClientRect();

  seed.className = "seed";
  /*const x = Math.floor(
    getRandomNumber(parentBoundBox.left + 40, parentBoundBox.right - 40)
  );
  const y = Math.floor(
    getRandomNumber(parentBoundBox.top + 20, parentBoundBox.bottom - 45)
  );*/
  const x = Math.floor(getRandomNumber(20, 60));
  const y = Math.floor(getRandomNumber(20, 65));
  const deg = Math.floor(getRandomNumber(0, 360));

  /*seed.style.left = x + "px";
  seed.style.top = y + "px";*/
  seed.style.left = x + "%";
  seed.style.top = y + "%";
  seed.style.transform = "rotate(" + deg + "deg)";
  return seed;
}

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function updateDisplay() {
  const storePlayerStatus =
    document.getElementsByClassName("storePlayerStatus")[0];
  const storeOpponentStatus = document.getElementsByClassName(
    "storeOpponentStatus"
  )[0];
  const storePlayer = document.getElementsByClassName("storePlayer")[0];
  const storeOpponent = document.getElementsByClassName("storeOpponent")[0];

  storePlayerStatus.innerHTML = game.storePlayer;
  updateSeeds(storePlayer, game.storePlayer);
  storeOpponentStatus.innerHTML = game.storeOpponent;
  updateSeeds(storeOpponent, game.storeOpponent);

  for (let i = 0; i < game.pits.length / 2; i++) {
    const pitPlayerStatus = document.getElementById("pitPlayerStatus" + i);
    pitPlayerStatus.innerHTML = game.pits[i];
    const pitPlayer = document.getElementById("pitPlayer" + i);
    updateSeeds(pitPlayer, game.pits[i]);
    const pitOpponentStatus = document.getElementById("pitOpponentStatus" + i);
    pitOpponentStatus.innerHTML = game.pits[i + game.pits.length / 2];
    const pitOpponent = document.getElementById("pitOpponent" + i);
    updateSeeds(pitOpponent, game.pits[i + game.pits.length / 2]);
  }
}

function updateSeeds(parent, targetNumber) {
  while (parent.childElementCount != targetNumber) {
    if (parent.childElementCount > targetNumber) {
      parent.removeChild(parent.firstChild);
    } else {
      parent.appendChild(createSeed(parent));
    }
  }
}

function forfeit() {
  gamesWonByPC++;
  replaceGameMessages(
    "You have forfeited the game. This point goes to the Opponent."
  );
  document.getElementById("opponentScore").innerHTML = gamesWonByPC;
}

function replaceGameMessages(message) {
  const gameMessages = document.getElementById("gameMessages");
  gameMessages.innerHTML = message;
}
