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
    this.pits = new Array(pitsStatus.length);
    for(let i = 0; i < pitsStatus.length; i++) {
      this.pits[i] = pitsStatus[i];
    }
    this.storePlayer = storePlayerStatus;
    this.difficultyAI = difficultyAI;
    this.turn = gameStarter;
  }

  gameMove(seedsInPit, pit) {
    //console.log(seedsInPit);

    const lastPlayed = {
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

    //console.log("offset is" + offset);
    //console.log("middle is" + middle);
    this.pits[pit + offset] = 0;
    //console.log(offset == middle);
    const length = this.pits.length + 1;

    for (let i = 1; i <= seedsInPit; i++) {
      const currentPosition = pit + i;
      //console.log("currentPosition is" + currentPosition);
      const relativePosition = (currentPosition + offset) % length;
      //console.log(relativePosition);

      if (offset == 0 && relativePosition == middle) {
        //console.log("offset = 0 and relativePosition = middle");
        this.storePlayer++;
        lastPlayed.event = "storePlayer";
        lastPlayed.eventPosition = currentPosition + offset;
        lastPlayed.eventRelativePosition = relativePosition;
      } else {
        if (offset == middle && relativePosition == length - 1) {
          //console.log("relativePosition = 0 and offset = middle");
          this.storeOpponent++;
          lastPlayed.event = "storeOpponent";
          lastPlayed.eventPosition = currentPosition + offset;
          lastPlayed.eventRelativePosition = relativePosition;
        } else {
          if (
            (offset == 0 && relativePosition > middle)
          ) {
            //console.log(
              //"offset = 0 & relative position > middle | offset = middle & relativePosition <= middle"
            //);
            this.pits[relativePosition - 1]++;
          } else {
            if (
              offset == 0 &&
              this.pits[relativePosition] == 0 &&
              relativePosition < middle
            ) {
              //console.log(
                //"offset = 0 & pit is empty & relativePosition < middle"
              //);
              lastPlayed.event = "emptyPitPlayer";
              lastPlayed.eventPosition = currentPosition + offset;
              lastPlayed.eventRelativePosition = relativePosition;
            }
            if (
              offset == middle &&
              this.pits[relativePosition] == 0 &&
              relativePosition > middle
            ) {
              //console.log(
                //"offset = middle & pit is empty & relativePosition > middle"
              //);
              lastPlayed.event = "emptyPitOpponent";
              lastPlayed.eventPosition = currentPosition + offset;
              lastPlayed.eventRelativePosition = relativePosition;
            }
            //console.log("at least I'm doing this");
            this.pits[relativePosition]++;
          }
        }
      }
      //console.log("and I'm also doing this");
      lastPlayed.lastPosition = currentPosition + offset;
      //console.log(this.pits);
    }

    if (
      lastPlayed.eventPosition == lastPlayed.lastPosition &&
      lastPlayed.event.includes("empty")
    ) {
      if (offset == 0) {
        //console.log("emptying the Oppponent's pit");
        this.storePlayer++;
        this.storePlayer +=
          this.pits[middle + middle - lastPlayed.eventRelativePosition - 1];
        this.pits[middle + middle - lastPlayed.eventRelativePosition - 1] = 0;
        this.pits[lastPlayed.eventRelativePosition] = 0;
      } else {
        //console.log("emptying the player's pit");
        this.storeOpponent++;
        this.storeOpponent +=
          this.pits[middle - (lastPlayed.eventRelativePosition - middle) - 1];
        this.pits[lastPlayed.eventRelativePosition - middle - 1] = 0;
        this.pits[lastPlayed.eventRelativePosition] = 0;
      }
    }
    //console.log("I managed to reach the end");

    const event = repeatPlay(lastPlayed);
    console.log("event is"+event);
    this.value = this.evaluateStatus(event);
    console.log("value of play"+this.value);
  }

  opponentTurn() {
    console.log(this);
    console.log("ThisIsTheOpponent'sTurn");

    const middle = this.pits.length / 2;
    const position = Math.floor(Math.random*middle);

    //const bestchild = this.getMin(1);
    const bestchild = this.getMin(this);

    this.updateMancala(bestchild.storeOpponent,bestchild.pits,bestchild.storePlayer,bestchild.difficultyAI,bestchild.turn);

    if(this.turn == "Opponent") this.opponentTurn();

    updateDisplay();
  }

  getMin(parent){
    const length = parent.pits.length/2;
    const children = new Array(length);
    for(let i = 0; i < length; i++){
      children[i] = parent.copy();
      console.log(children[i]);
    
        children[i].gameMove(children[i].pits[i+length],i);
        if(children[i].value[0] == 0 && !(children[i].value[1] >= -7 && children[i].value[1]<=-5)) children[i].turn = "Player";
        console.log(game);
        console.log(children[i]);
      }
    let bestchild = children[0].copy();
    for (let i = 1; i < length; i++) {
        if(children[i].value[1]<bestchild.value[1]) { bestchild = children[i].copy(); }
    }
  
      return bestchild;
    
  }

  /*getMin(depth){
    const length = this.pits.length/2;
    const children = new Array(length);
    for(let i = 0; i < length; i++){
      children[i] = new Mancala();
      children[i].updateMancala(this.storeOpponent,this.pits,this.storePlayer,this.difficultyAI,this.turn);
      if(children[i].pits[i+length] > 0) {
        children[i].gameMove(children[i].pits[i+length],i);
        if(children[i].value[0] == 0 && !(children[i].value[1] >= -7 && children[i].value[1]<=-5)) children[i].turn = "Player";
        console.log(game);
        console.log(children[i]);
      }
      else { children[i].value = children[i].evaluateStatus(""); }
    }
    console.log("depth = AI"+(depth == this.difficultyAI));
    if(depth == this.difficultyAI){
      let bestchild = children[0];
      let bestvalue = children[0].value[1];
      for (let i = 1; i < length; i++) {
        if(children[i].value[1]<bestvalue) bestchild = children[i];
      }
      return bestchild;
    }
    else {
      for(let i=0; i < length; i++) {
        if(children[i].value[0] == 0 && children[i].turn == "Player") { children[i] = children[i].getMax(depth+1); }
        if(children[i].value[0] == 0 && children[i].turn == "Opponent") { children[i] = children[i].getMin(depth+1); }
      }
      let bestchild = children[0];
      for(let i = 1; i < length;i++){
        if(children[i].value[1]<bestchild.value[1]) bestchild = children[i];
      }
      return bestchild;
    }
  }

  getMax(depth){
    const length = this.pits.length/2;
    const children = new Array(length);
    for(let i = 0; i < length; i++){
      children[i] = new Mancala();
      children[i].updateMancala(this.storeOpponent,this.pits,this.storePlayer,this.difficultyAI,this.turn);
      if(children[i].pits[i] > 0) {
        children[i].gameMove(children[i].pits[i],i);
        if(children[i].value[0] == 0 && !(children[i].value[1] >= 5 && children[i].value[1]<=7)) children[i].turn = "Opponent";
      }
    }
    if(depth == this.difficultyAI){
      let bestchild = children[0];
      for (let i = 1; i < length; i++) {
        if(children[i].value[1]>bestchild.value[1]) bestchild = children[i];
      }
      return bestchild;
    }
    else {
      for(let i=0; i < length; i++) {
        if(children[i].value[0] == 0 && children[i].turn == "Player") { children[i] = children[i].getMax(depth+1); }
        if(children[i].value[0] == 0 && children[i].turn == "Opponent") { children[i] = children[i].getMin(depth+1); }
      }
      let bestchild = children[0];
      for(let i = 1; i < length;i++){
        if(children[i].value[1]>bestchild.value[1]) bestchild = children[i];
      }
      return bestchild;
    }
  }*/


  evaluateStatus(repeatOrNot){
    const middle = this.pits.length/2;
    let seedsPlayer = 0;
    let seedsOpponent = 0;
    for (let i = 0; i < middle; i++) {
      seedsPlayer += this.pits[i];
      seedsOpponent += this.pits[i+middle];
    }
    if(seedsPlayer == 0 || seedsOpponent == 0) {
      if(seedsPlayer+this.storePlayer > seedsOpponent+this.storeOpponent) {
        return [1,10];
      }
      else { 
        if (seedsPlayer+this.storePlayer == seedsOpponent+this.storeOpponent) {
          return [1,0];
        }
        else { return [1,-10]; }
      }
    } else{
      if(repeatOrNot == "Player") {
        if(this.seedsPlayer > this.seedsOpponent) return [0,7];
        if(this.seedsPlayer == this.seedsOpponent) return [0,6];
        if(this.seedsPlayer < this.seedsOpponent) return [0,5];
      }
      if(repeatOrNot == "Opponent") {
        if(this.seedsPlayer < this.seedsOpponent) return [0,-7];
        if(this.seedsPlayer == this.seedsOpponent) return [0,-6];
        if(this.seedsPlayer > this.seedsOpponent) return [0,-5];
      }
      if(this.seedsPlayer > this.seedsOpponent) return [0,1];
      if(this.seedsPlayer == this.seedsOpponent) return [0,0];
      if(this.seedsPlayer < this.seedsOpponent) return [0,-1];
    }
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
    const element = ((x) => {
      if (x.path[0].classList.value == "seed") {
        return x.path[0].parentElement;
      } else {
        return x.srcElement;
      }
    })(event);
    console.log(event);
    console.log(element);
    console.log("logging" + this);

    const pit = parseInt(element.id.slice(-1));

    console.log(pit);

    const seedsInPit = game.pits[pit];
    if (seedsInPit == 0) {
      replaceGameMessages(
        "You can't select an empty pit to play. Please play again."
      );
    } else {
      game.gameMove(seedsInPit, pit);

      const eval = game.value;

      if (eval[0] == 0){
        if (eval[1] >= 5 && eval[1] <= 7) {
          replaceGameMessages("The " + game.turn + " may play again");
          updateDisplay();
        } else {
          game.turn = "Opponent";
          replaceGameMessages("It is now the " + game.turn + "'s turn to play.");
          updateDisplay();
          game.opponentTurn();
      }
    } else{
      if(eval[1] == 10){
        replaceGameMessages("The Game Is Over. Player Wins.");
        gamesWonByPlayer++;
        document.getElementById("playerScore").innerHTML = gamesWonByPlayer;
      }
      if(eval[1] == 0){
        replaceGameMessages("The Game Is Over. It's a Tie.");
      }
      if(eval[1] == -10){
        gamesWonByPC++;
        document.getElementById("opponentScore").innerHTML = gamesWonByPC;
      }
      updateDisplay();
    }
    }
  }
}

function repeatPlay(lastPlayed) {
  if (
    lastPlayed.eventPosition == lastPlayed.lastPosition &&
    lastPlayed.event.includes("store")
  ) {
    console.log("I did return stuff");
    return lastPlayed.event.replace("store", "");
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
