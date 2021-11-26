("use strict");

function toggleElementDisplayOpen(event) {
  const x = event.srcElement;
  if (x.classList.contains("rulesList")) {
    const y = document.getElementById(x.id.replace("Toggle", ""));
    y.classList.toggle("displayed");
  } else {
    if (x.id == "settingsStartGameButton") {
      const y = document.getElementById("tabGameSettings");
      y.classList.toggle("open");
    } else {
      if (x.classList.contains("selectionBarItem")) {
        const y = document.getElementById(
          x.id.replace("selectionBarItem", "tab")
        );
        if (!y.classList.contains("open")) {
          const tabs = document.getElementsByClassName("tempFloatingTab");
          for (let i of tabs) {
            if (i.id != y.id) {
              if (i.classList.contains("open")) i.classList.toggle("open");
            }
          }
        }
        y.classList.toggle("open");
        if (x.id == "selectionBarItemGameRules") {
          for (let i of y.children) {
            if (i.classList.contains("displayed"))
              i.classList.toggle("displayed");
          }
        }
      } else {
        const y = document.getElementById(x.id.replace("Button", ""));
        x.classList.toggle("open");
        y.classList.toggle("open");
      }
    }
  }
}

function startGame(event) {
  const playTableElement = document.getElementById("playTable");

  while (playTableElement.firstChild)
    playTableElement.removeChild(playTableElement.lastChild);

  const gameStatusElement = document.getElementById("gameStatus");

  while (gameStatusElement.firstChild)
    gameStatusElement.removeChild(gameStatusElement.lastChild);

  const numberOfPits = parseInt(
    document.querySelector('input[name="settingsPitsRadio"]:checked').value
  );
  const initialSeedNumber = parseInt(
    document.querySelector('input[name="numberSeeds"]').value
  );
  const difficultyAI = parseInt(
    document.querySelector('select[name="difficultySelector"]').value
  );

  const gameStarter =
    document.querySelector('input[name="settingsFirstTurnRadio"]:checked')
      .value == "gameStartedByPlayer"
      ? "Player"
      : "Opponent";

  const returnObject = drawBoard(
    numberOfPits,
    initialSeedNumber,
    gameStarter,
    playTableElement,
    gameStatusElement
  );

  game.updateMancala(
    returnObject.pitsStatus,
    gameStarter,
    [0, 0],
    numberOfPits,
    returnObject.storePlayerPosition,
    returnObject.storeOpponentPosition,
    difficultyAI
  );
  updateDisplay();

  toggleElementDisplayOpen(event);

  if (game.turn == "Opponent") game.opponentTurn();
}

function forfeit() {
  gamesWonByPC++;
  replaceGameMessages(
    "You have forfeited the game. This point goes to the Opponent."
  );
  document.getElementById("opponentScore").innerHTML = gamesWonByPC;
}

function gamePlayerPlay(event) {
  if (game.value[0] == 1) {
    replaceGameMessages("The game is over. You may start a new game.");
  } else {
    if (game.turn == "Opponent") {
      replaceGameMessages(
        "It's not your turn. Please allow the Opponent to finish his play."
      );
    } else {
      const path = event.composedPath();
      const element =
        path[0].classList.value == "seed"
          ? path[0].parentElement
          : event.srcElement;

      //console.log(event);
      //console.log(element);

      //console.log("logging" + this);

      game.playerTurn(element);
    }
  }
}

function validPlay(event) {
  const path = event.composedPath();
  const element =
    path[0].classList.value == "seed"
          ? path[0].parentElement
          : event.srcElement; 

  const pit = parseInt(element.id.slice(-1));

  if (game.pits[pit] == 0) {
    element.style.backgroundColor = "red";
  } else {
    element.style.backgroundColor = "green";
  }
  element.style.opacity = 0.5;
}

function clearValidPlay(event) {
  const path = event.composedPath();
  const element =
  path[0].classList.value == "seed"
          ? path[0].parentElement
          : event.srcElement;

  const pit = parseInt(element.id.slice(-1));

  element.style.backgroundColor = "";
  element.style.opacity = "";
}
