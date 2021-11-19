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
          if(!y.classList.contains("open")){
            const tabs = document.getElementsByClassName("tempFloatingTab");
            for(let i of tabs) {
              if (i.id != y.id) {
                if (i.classList.contains("open")) i.classList.toggle("open");
              }
            }
          }
          y.classList.toggle("open");
          if (x.id == "selectionBarItemGameRules") { 
            for(let i of y.children) {
              if (i.classList.contains("displayed")) i.classList.toggle("displayed");
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

    while(playTableElement.firstChild) playTableElement.removeChild(playTableElement.lastChild);

    const gameStatusElement = document.getElementById("gameStatus");

    while(gameStatusElement.firstChild) gameStatusElement.removeChild(gameStatusElement.lastChild);

    const numberOfPits = parseInt(
      document.querySelector('input[name="settingsPitsRadio"]:checked').value
    );
    const initialSeedNumber = parseInt(
      document.querySelector('input[name="numberSeeds"]').value
    );
    const difficultyAI = parseInt(
      document.querySelector('select[name="difficultySelector"]').value
    );
    
    const gameStarter = (document.querySelector('input[name="settingsFirstTurnRadio"]:checked').value == "gameStartedByPlayer") ? "Player" : "Opponent";
    
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
      [0,0],
      numberOfPits,
      returnObject.storePlayerPosition,
      returnObject.storeOpponentPosition,
      difficultyAI
    );
    updateDisplay();

    toggleElementDisplayOpen(event);

    if(game.turn == "Opponent") game.opponentTurn();
  }
  
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
    storeOpponent.classList.add("storeOpponent", "clickable");
    gameBoardElement.appendChild(storeOpponent);
    const storeOpponentStatus = document.createElement("div");
    storeOpponentStatus.className = "storeOpponentStatus";
    storeOpponentStatus.innerHTML = 0;
    gameStatusBoxElement.appendChild(storeOpponentStatus);
  
    const gamePits = document.createElement("div");
    gamePits.className = "gamePits";
    gameBoardElement.appendChild(gamePits);
    const gamePitsStatus = document.createElement("div");
    gamePitsStatus.className = "gamePitsStatus";
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
    storePlayer.classList.add("storePlayer", "clickable");
    gameBoardElement.appendChild(storePlayer);
    const storePlayerStatus = document.createElement("div");
    storePlayerStatus.className = "storePlayerStatus";
    storePlayerStatus.innerHTML = 0;
    gameStatusBoxElement.appendChild(storePlayerStatus);
  
    for (let i = 0; i < numberOfPits; i++) {
      pitsBoardStatus[i] = initialSeedNumber;
      pitsBoardStatus[i + numberOfPits + 1] = initialSeedNumber;
  
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

    const storePlayerPosition = numberOfPits;
    const storeOpponentPosition = 2*numberOfPits+1;
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
      storeOpponentPosition: storeOpponentPosition
    };
  
    gameBoardElement.style.borderStyle = "solid";
  
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
      pit.addEventListener("click", gamePlayerPlay);
      pit.addEventListener("mouseover",validPlay);
      pit.addEventListener("mouseout",clearValidPlay);
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
  
    storePlayerStatus.innerHTML = game.pits[game.storePlayerPosition];
    updateSeeds(storePlayer, game.pits[game.storePlayerPosition]);
    storeOpponentStatus.innerHTML = game.pits[game.storeOpponentPosition];
    updateSeeds(storeOpponent, game.pits[game.storeOpponentPosition]);
  
    for (let i = 0; i < game.numberOfPits ; i++) {
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
  
  function gamePlayerPlay(event) {
    if(game.value[0] == 1) { replaceGameMessages(
      "The game is over. You may start a new game."
    ); } else {

    if (game.turn == "Opponent") {
      replaceGameMessages(
        "It's not your turn. Please allow the Opponent to finish his play."
      );
    } else {
      
      const element = (event.path[0].classList.value == "seed") ? event.path[0].parentElement : event.srcElement;
      
      //console.log(event);
      //console.log(element);

      //console.log("logging" + this);
      
      game.playerTurn(element);
      
    
      }
    } }
   
  
  function validPlay(event){
    const element = ((x) => {
      if (x.path[0].classList.value == "seed") {
        return x.path[0].parentElement;
      } else {
        return x.srcElement;
      }
    })(event);
  
    const pit = parseInt(element.id.slice(-1));
  
    if(game.pits[pit] == 0) {
      element.style.backgroundColor = "red";
    }
    else { element.style.backgroundColor = "green"; }
    element.style.opacity = 0.5;
  }
  
  function clearValidPlay(event){
    const element = ((x) => {
      if (x.path[0].classList.value == "seed") {
        return x.path[0].parentElement;
      } else {
        return x.srcElement;
      }
    })(event);
  
    const pit = parseInt(element.id.slice(-1));
  
    element.style.backgroundColor = "";
    element.style.opacity = "";
  }