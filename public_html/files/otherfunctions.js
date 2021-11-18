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
    const element = document.getElementById("gameBoard");
    while(element.firstChild) element.removeChild(element.lastChild);
    const element2 = document.getElementById("gameStatusBox");
    while(element2.firstChild) element2.removeChild(element2.lastChild);
    const forfeitButton = document.getElementById("forfeitButton");
    if (forfeitButton != null) forfeitButton.remove();
    const gameMessages = document.getElementById("gameMessages");
    if (gameMessages != null) gameMessages.remove();
  
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
    if(game.turn == "Opponent") game.opponentTurn();
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
    forfeitButton.id = "forfeitButton";
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
  
  function gamePlayerPlay(event) {
    if (game.turn == "Opponent") {
      replaceGameMessages(
        "It's not your turn. Please allow the Opponent to finish his play."
      );
    } else {
      
      const element = (event.path[0].classList.value == "seed") ? event.path[0].parentElement : event.srcElement;
      
      console.log(event);
      console.log(element);

      console.log("logging" + this);
      game.playerTurn(element);
      
    
      }
    }
   
  
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