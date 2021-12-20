"use strict";

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

  game.updateMancala(
    Array(2*numberOfPits+2).fill(initialSeedNumber),
    gameStarter,
    [0, 0],
    numberOfPits,
    numberOfPits,
    2*numberOfPits+1,
    difficultyAI
  );

  if (playOnline == "Yes") {
    const serverMessages = document.getElementById("serverMessages");

    if (game.onlineStatus == "LoggedIn") {

      game.playOnline = "Yes";

      serverMessages.innerHTML = "Entering pairing mode";
      
      join(game.nick, game.password, numberOfPits, initialSeedNumber);

    } else {
      serverMessages.innerHTML =
        "To start an online game, please authenticate yourself first";
      return ;
    }
  }

  drawBoard(
    numberOfPits,
    initialSeedNumber,
    playTableElement,
    gameStatusElement
  );

  if (playOnline == "No" && game.turn == "Opponent") game.opponentTurn();
  else updateDisplay();
} /* end of Start Game function */

/* function to Forfeit. Increments number of games won by PC and writes a forfeit message */
function forfeit() {
  if(game.playOnline == "Yes"){
    leave(game.nick,game.password,game.hash);
  }else {

    let posPlayer = 0;
    let posComputer = 0;
    
    for(let i = 0; i < offlineRankings.length; i++) {
      if (offlineRankings[i].nick == game.nick) posPlayer = i;
      if (offlineRankings[i].nick == 'computer') posComputer = i;
    }

    if (posPlayer == null) {
      posPlayer = offlineRankings.length;
      offlineRankings[posPlayer] = {nick: game.nick, victories: 0, games: 0};
    }
    
    offlineRankings[posPlayer].games++;
    offlineRankings[posComputer].games++;
    offlineRankings[posComputer].victories++;
    
    sortOfflineRankings();

  //gamesWonByPC++; 
  replaceGameMessages(
    "You have forfeited the game. This point goes to the Opponent."
  );
  //document.getElementById("opponentScore").innerHTML = gamesWonByPC;
  updateRankingsTable('offline',offlineRankings);
  }
  
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
      animateSeeds(this,game.pits[pit],pit);
      if (game.playOnline == "Yes") {
        notify(game.nick, game.password, game.hash, pit);
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
