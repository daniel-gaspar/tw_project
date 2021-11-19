("use strict");

function drawBoard(
  numberOfPits,
  initialSeedNumber,
  gameStarter,
  playTableElement,
  gameStatusElement
) {
  const gameBoardElement = document.createElement("div");
  gameBoardElement.id = "gameBoard";
  playTableElement.appendChild(gameBoardElement);

  const gameStatusBoxElement = document.createElement("div");
  gameStatusBoxElement.id = "gameStatusBox";
  gameStatusElement.appendChild(gameStatusBoxElement);

  const pitsBoardStatus = [];

  const storeOpponent = document.createElement("div");
  storeOpponent.id = "storeOpponent";
  storeOpponent.classList.add("storeOpponent", "pit", "store");
  gameBoardElement.appendChild(storeOpponent);
  const storeOpponentStatus = document.createElement("div");
  storeOpponentStatus.id = "storeOpponentStatus";
  storeOpponentStatus.classList.add("storeOpponentStatus","pit", "store");
  storeOpponentStatus.innerHTML = 0;
  gameStatusBoxElement.appendChild(storeOpponentStatus);

  const gamePits = document.createElement("div");
  gamePits.id = "gamePits";
  const x = 8*numberOfPits;
  gamePits.style.width = x + "%";
  gameBoardElement.appendChild(gamePits);
  const gamePitsStatus = document.createElement("div");
  gamePitsStatus.id = "gamePitsStatus";
  gamePitsStatus.style.width = x + "%";
  gameStatusBoxElement.appendChild(gamePitsStatus);

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
  storePlayer.classList.add("storePlayer", "pit", "store");
  gameBoardElement.appendChild(storePlayer);
  const storePlayerStatus = document.createElement("div");
  storePlayerStatus.classList.add("storePlayerStatus","pit","store");
  storePlayerStatus.innerHTML = 0;
  gameStatusBoxElement.appendChild(storePlayerStatus);

  for (let i = 0; i < numberOfPits; i++) {
    pitsBoardStatus[i] = initialSeedNumber;
    pitsBoardStatus[i + numberOfPits + 1] = initialSeedNumber;

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

  const storePlayerPosition = numberOfPits;
  const storeOpponentPosition = 2 * numberOfPits + 1;
  pitsBoardStatus[storePlayerPosition] = 0;
  pitsBoardStatus[storeOpponentPosition] = 0;

  const gameMessages = document.createElement("div");
  gameMessages.id = "gameMessages";
  gameMessages.className = "gameMessages";
  gameMessages.innerHTML = "It is now the " + gameStarter + "'s turn to play.";
  playTableElement.appendChild(gameMessages);

  const forfeitButton = document.createElement("div");
  forfeitButton.id = "forfeitButton";
  forfeitButton.classList.add("forfeitButton", "clickable");
  forfeitButton.addEventListener("click", forfeit);
  forfeitButton.innerHTML = "Forfeit";
  playTableElement.appendChild(forfeitButton);

  const returnObject = {
    pitsStatus: pitsBoardStatus,
    storePlayerPosition: storePlayerPosition,
    storeOpponentPosition: storeOpponentPosition,
  };

  gameBoardElement.style.borderStyle = "solid";

  return returnObject;
}

function createPit(playerOrOpponent, i, numberOfPits) {
  const pit = document.createElement("div");
  pit.id = "pit" + playerOrOpponent + i;
  pit.classList.add("pit" + playerOrOpponent);
  pit.classList.add("pit");
  if (!pit.id.includes("Status")) {
    pit.classList.add("clickable");
  }
  pit.style.width = (((1/numberOfPits) * 100) - (12/numberOfPits)) + "%";
  if (playerOrOpponent == "Player") {
    pit.addEventListener("click", gamePlayerPlay);
    pit.addEventListener("mouseover", validPlay);
    pit.addEventListener("mouseout", clearValidPlay);
  }

  return pit;
}

function createSeed(parent) {
  const seed = document.createElement("div");
  const parentBoundBox = parent.getBoundingClientRect();

  seed.className = "seed";

  const x = Math.floor(getRandomNumber(20, 60));
  const y = Math.floor(getRandomNumber(20, 65));
  const deg = Math.floor(getRandomNumber(0, 360));

  seed.style.left = x + "%";
  seed.style.top = y + "%";
  seed.style.transform = "rotate(" + deg + "deg)";
  return seed;
}

function updateDisplay() {
  const storePlayerStatus =
    document.getElementsByClassName("storePlayerStatus")[0];
  const storeOpponentStatus = document.getElementsByClassName(
    "storeOpponentStatus"
  )[0];
  const storePlayer = document.getElementsByClassName("storePlayer")[0];
  const storeOpponent = document.getElementsByClassName("storeOpponent")[0];

  storePlayerStatus.innerHTML = game.pits[game.storePlayerPosition];
  updateSeeds(storePlayer, game.pits[game.storePlayerPosition]);
  storeOpponentStatus.innerHTML = game.pits[game.storeOpponentPosition];
  updateSeeds(storeOpponent, game.pits[game.storeOpponentPosition]);

  for (let i = 0; i < game.numberOfPits; i++) {
    const pitPlayerStatus = document.getElementById("pitPlayerStatus" + i);
    pitPlayerStatus.innerHTML = game.pits[i];
    const pitPlayer = document.getElementById("pitPlayer" + i);
    updateSeeds(pitPlayer, game.pits[i]);
    const pitOpponentStatus = document.getElementById("pitOpponentStatus" + i);
    pitOpponentStatus.innerHTML = game.pits[i + game.numberOfPits + 1];
    const pitOpponent = document.getElementById("pitOpponent" + i);
    updateSeeds(pitOpponent, game.pits[i + game.numberOfPits + 1]);
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

function replaceGameMessages(message) {
  const gameMessages = document.getElementById("gameMessages");
  gameMessages.innerHTML = message;
}