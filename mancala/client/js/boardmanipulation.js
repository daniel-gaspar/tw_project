"use strict";

/* creates all the necessary elements for the Game Board and the Game Status */
function drawBoard(
  numberOfPits,
  initialSeedNumber,
  playTableElement,
  gameStatusElement
) {
  const gameBoardElement = document.createElement("div");
  gameBoardElement.id = "gameBoard";
  playTableElement.appendChild(gameBoardElement);

  const gameStatusBoxElement = document.createElement("div");
  gameStatusBoxElement.id = "gameStatusBox";
  gameStatusElement.appendChild(gameStatusBoxElement);

  const storeOpponent = document.createElement("div");
  storeOpponent.id = "storeOpponent";
  storeOpponent.classList.add("pit", "store");
  gameBoardElement.appendChild(storeOpponent);
  const storeOpponentStatus = document.createElement("div");
  storeOpponentStatus.id = "storeOpponentStatus";
  storeOpponentStatus.classList.add("pit", "store", "pitStatus", "storeStatus");
  storeOpponentStatus.innerHTML = 0;
  gameStatusBoxElement.appendChild(storeOpponentStatus);

  const gamePits = document.createElement("div");
  gamePits.id = "gamePits";
  gamePits.classList.add("pitsBox");
  const x = 8 * numberOfPits;
  gamePits.style.width = x + "%";
  gameBoardElement.appendChild(gamePits);
  const gamePitsStatus = document.createElement("div");
  gamePitsStatus.id = "gamePitsStatus";
  gamePitsStatus.classList.add("pitsBox", "pitsBoxStatus");
  gamePitsStatus.style.width = x + "%";
  gameStatusBoxElement.appendChild(gamePitsStatus);

  const gamePitsOpponent = document.createElement("div");
  gamePitsOpponent.id = "gamePitsOpponent";
  gamePitsOpponent.classList.add("pitsRow");
  gamePits.appendChild(gamePitsOpponent);
  const gamePitsOpponentStatus = document.createElement("div");
  gamePitsOpponentStatus.id = "gamePitsOpponentStatus";
  gamePitsOpponentStatus.classList.add("pitsRow", "pitsRowStatus");
  gamePitsStatus.appendChild(gamePitsOpponentStatus);

  const gamePitsPlayer = document.createElement("div");
  gamePitsPlayer.id = "gamePitsPlayer";
  gamePitsPlayer.classList.add("pitsRow");
  gamePits.appendChild(gamePitsPlayer);
  const gamePitsPlayerStatus = document.createElement("div");
  gamePitsPlayerStatus.id = "gamePitsPlayerStatus";
  gamePitsPlayerStatus.classList.add("pitsRow", "pitsRowStatus");
  gamePitsStatus.appendChild(gamePitsPlayerStatus);

  const storePlayer = document.createElement("div");
  storePlayer.id = "storePlayer";
  storePlayer.classList.add("pit", "store");
  gameBoardElement.appendChild(storePlayer);
  const storePlayerStatus = document.createElement("div");
  storePlayerStatus.id = "storePlayerStatus";
  storePlayerStatus.classList.add("pit", "store", "pitStatus", "storeStatus");
  storePlayerStatus.innerHTML = 0;
  gameStatusBoxElement.appendChild(storePlayerStatus);

  for (let i = 0; i < numberOfPits; i++) {

    const pitPlayer = createPit("Player", i, numberOfPits);
    gamePitsPlayer.appendChild(pitPlayer);
    const pitPlayerStatus = createPit("PlayerStatus", i, numberOfPits);
    pitPlayerStatus.innerHTML = initialSeedNumber;
    gamePitsPlayerStatus.appendChild(pitPlayerStatus);

    const pitOpponent = createPit("Opponent", i, numberOfPits);
    gamePitsOpponent.appendChild(pitOpponent);
    const pitOpponentStatus = createPit("OpponentStatus", i, numberOfPits);
    pitOpponentStatus.innerHTML = initialSeedNumber;
    gamePitsOpponentStatus.appendChild(pitOpponentStatus);

  }

  const gameMessages = document.createElement("div");
  gameMessages.id = "gameMessages";
  gameMessages.className = "gameMessages";
  gameMessages.innerHTML = "It is now the " + game.turn + "'s turn to play.";
  playTableElement.appendChild(gameMessages);

  const forfeitButton = document.createElement("div");
  forfeitButton.id = "forfeitButton";
  forfeitButton.classList.add("button", "clickable");
  forfeitButton.addEventListener("click", forfeit);
  forfeitButton.innerHTML = "Forfeit";
  playTableElement.appendChild(forfeitButton);

  gameBoardElement.style.borderStyle = "solid";

} /* end of drawBoard function */

/* generalized function to create Pits */
function createPit(playerOrOpponent, i, numberOfPits) {
  const pit = document.createElement("div");
  pit.id = "pit" + playerOrOpponent + i;
  pit.classList.add("pit" + playerOrOpponent, "pit");
  if (!pit.id.includes("Status")) {
    pit.classList.add("clickable");
  } else {
    pit.classList.add("pitStatus");
  }

  pit.style.width = (1 / numberOfPits) * 100 - 12 / numberOfPits + "%";
  if (playerOrOpponent == "Player") {
    pit.addEventListener("click", gamePlayerPlay.bind(pit, i));
    pit.addEventListener("mouseover", validPlay.bind(pit, i));
    pit.addEventListener("mouseout", clearValidPlay.bind(pit, i));
  }

  return pit;
} /* end of createPit function */

/* generalized function to create Seeds */
function createSeed(parent) {
  const seed = document.createElement("div");

  seed.className = "seed";

  const x = getRandomNumber(20, 60);
  const y = getRandomNumber(20, 65);
  const deg = getRandomNumber(0, 360);

  seed.style.left = x + "%";
  seed.style.top = y + "%";
  seed.style.transform = "rotate(" + deg + "deg)";
  return seed;
} /* end of createSeed function */

/* function to update the Game Board and Game Status based on the game Object (class Mancala) */
function updateDisplay() {
  const storePlayerStatus = document.getElementById("storePlayerStatus");
  const storeOpponentStatus = document.getElementById("storeOpponentStatus");
  const storePlayer = document.getElementById("storePlayer");
  const storeOpponent = document.getElementById("storeOpponent");

  storePlayerStatus.innerHTML = game.pits[game.storePlayerPosition];
  updateSeeds(storePlayer, game.pits[game.storePlayerPosition]);
  storeOpponentStatus.innerHTML = game.pits[game.storeOpponentPosition];
  updateSeeds(storeOpponent, game.pits[game.storeOpponentPosition]);

  const offset = game.numberOfPits+1;

  for (let i = 0; i < game.numberOfPits; i++) {
    const seedsPlayer = game.pits[i];
    const pitPlayerStatus = document.getElementById("pitPlayerStatus" + i);
    pitPlayerStatus.innerHTML = seedsPlayer;
    const pitPlayer = document.getElementById("pitPlayer" + i);
    updateSeeds(pitPlayer, seedsPlayer);
    const seedsOpponent = game.pits[i + offset];
    const pitOpponentStatus = document.getElementById("pitOpponentStatus" + i);
    pitOpponentStatus.innerHTML = seedsOpponent;
    const pitOpponent = document.getElementById("pitOpponent" + i);
    updateSeeds(pitOpponent, seedsOpponent);
  }
} /* end of updateDisplay fuinction */

/* generalized function to update the Number of Seeds inside a pit (graphical) */
function updateSeeds(parent, targetNumber) {
  while (parent.childElementCount != targetNumber) {
    if (parent.childElementCount > targetNumber) {
      parent.removeChild(parent.firstChild);
    } else {
      parent.appendChild(createSeed(parent));
    }
  }
} /* end of updateSeeds function */

/* generalized function to update the text inside the Div with the Game Messages */
function replaceGameMessages(message) {
  const gameMessages = document.getElementById("gameMessages");
  gameMessages.innerHTML = message;
} /* end of replaceGameMessages function */

function replaceServerMessages(message) {
  const serverMessages = document.getElementById("serverMessages");
  serverMessages.innerHTML = message;
}