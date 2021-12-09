("use strict");

/* function to toggle some elements between their CSS classes, namely to display them or not */
function toggleElementDisplayOpen() {
  let toggleElement = this;

  if (this.id == "settingsStartGameButton") {
    toggleElement = document.getElementById("tabGameSettings");
  }
  if (this.classList.contains("selectionBarItem")) {
    closeRules();
    toggleElement = document.getElementById(
      this.id.replace("selectionBarItem", "tab")
    );
    if (!toggleElement.classList.contains("open")) {
      const tabs = document.getElementsByClassName("tempFloatingTab");
      for (let i of tabs) {
        if (i.id != toggleElement.id && i.classList.contains("open")) {
          i.classList.toggle("open");
        }
      }
    }
  }
  if (this.id == "authAreaButton") {
    const tab = document.getElementById(this.id.replace("Button", ""));
    tab.classList.toggle("open");
  }
  if (this.classList.contains("rulesList")) {
    toggleElement = document.getElementById(this.id.replace("Toggle", ""));
  }

  toggleElement.classList.toggle("open");
} /* end of toggle function */

function closeRules() {
  const tabGameRules = document.getElementById("tabGameRules");
  for (let i of tabGameRules.children) {
    if (i.classList.contains("open")) i.classList.toggle("open");
  }
}

/* function to Start Game. Triggered by Start Game Button */
function startGame() {
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

  const gameStarter = document.querySelector(
    'input[name="settingsFirstTurnRadio"]:checked'
  ).value;

  const playOnline = document.querySelector(
    'input[name="settingsGameOnline"]:checked'
  ).value;

  if (playOnline == "Yes") {
    if (game.onlineStatus == "LoggedIn") {
      game.playOnline = playOnline;

      join(game.nick, game.password, numberOfPits, initialSeedNumber);
    } else {
      const serverMessages = document.getElementById("serverMessages");
      serverMessages.innerHTML =
        "To start an online game, please authenticate yourself first";
    }
  }

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

  if (playOnline == "No" && game.turn == "Opponent") game.opponentTurn();
} /* end of Start Game function */

/* function to Forfeit. Increments number of games won by PC and writes a forfeit message */
function forfeit() {
  gamesWonByPC++;
  replaceGameMessages(
    "You have forfeited the game. This point goes to the Opponent."
  );
  document.getElementById("opponentScore").innerHTML = gamesWonByPC;
} /* end of forfeit function */

/* function to start player Play. Triggered by clicking one of the Player's pits */
function gamePlayerPlay(pit) {
  if (game.value[0] == 1) {
    replaceGameMessages("The game is over. You may start a new game.");
  } else {
    if (game.turn == "Opponent") {
      replaceGameMessages(
        "It's not your turn. Please allow the Opponent to finish his play."
      );
    } else {
      if (game.playOnline == "Yes") {
        notify(game.nick, game.pass, game.hash, pit);
      } else {
        game.playerTurn(pit);
      }
    }
  }
} /* end of gamePlayerPlay function */

/* function that verifies if it's a valid play. Triggered on Mouse Hover over pit */
function validPlay(pit) {
  if (game.pits[pit] == 0) {
    this.style.backgroundColor = "red";
  } else {
    this.style.backgroundColor = "green";
  }
  this.style.opacity = 0.5;
} /* end of function to verify a valid play */

/* function that clears the valid play check. Triggered when Mouse isn't hovering anymore over pit */
function clearValidPlay(pit) {
  this.style.backgroundColor = "";
  this.style.opacity = "";
} /* end of clearValidPlay function */

function login(event) {
  const nick = document.getElementById("authUsername").value;
  const password = document.getElementById("authPassword").value;

  register(nick, password);
}
