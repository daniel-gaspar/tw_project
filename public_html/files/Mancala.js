("use strict");

class Mancala {
  /* constructs the Mancala object */
  constructor(
    numberOfPitsStatus = 4,
    pitsStatus = [4, 4, 4, 4, 0, 4, 4, 4, 4, 0],
    storePlayerPositionStatus = 4,
    storeOpponentPositionStatus = 9,
    difficultyAIStatus = 1,
    gameTurnStatus = "Player",
    gameValue = [0, 0]
  ) {
    this.numberOfPits = numberOfPitsStatus;
    this.pits = pitsStatus.slice();
    this.storePlayerPosition = storePlayerPositionStatus;
    this.storeOpponentPosition = storeOpponentPositionStatus;
    this.difficultyAI = difficultyAIStatus;
    this.turn = gameTurnStatus;
    this.value = gameValue.slice();
  } /* end of constructor */

  /* creates a "safe copy" of the Mancala Object */
  copy() {
    const numberOfPits = this.numberOfPits;

    const pits = this.pits.slice();

    const storePlayerPosition = this.storePlayerPosition;

    const storeOpponentPosition = this.storeOpponentPosition;

    const difficultyAI = this.difficultyAI;

    const turn = this.turn;

    const gameValue = this.value.slice();

    return new Mancala(
      numberOfPits,
      pits,
      storePlayerPosition,
      storeOpponentPosition,
      difficultyAI,
      turn,
      gameValue
    );
  } /* end of copy method */

  /* updates the Mancala object with the given values */
  updateMancala(
    pitsStatus,
    gameTurnStatus,
    gameValueStatus,
    numberOfPitsStatus=this.numberOfPits,
    storePlayerPositionStatus=this.storePlayerPosition,
    storeOpponentPositionStatus=this.storeOpponentPosition,
    difficultyAIStatus=this.difficultyAI
  ) {
    this.numberOfPits = numberOfPitsStatus;

    this.pits = pitsStatus.slice();

    this.storePlayerPosition = storePlayerPositionStatus;

    this.storeOpponentPosition = storeOpponentPositionStatus;

    this.difficultyAI = difficultyAIStatus;

    this.turn = gameTurnStatus;

    this.value = gameValueStatus.slice();
  } /* end of the update method */

  /* returns a value for the current status of the game, depending on the current this.pits configuration (and whether there's anyone playing again) */
  evaluateStatus(repeatOrNot) {
    let seedsPlayer = 0;
    let seedsOpponent = 0;

    const seedsInStorePlayer = this.pits[this.storePlayerPosition];
    const seedsInStoreOpponent = this.pits[this.storeOpponentPosition];

    /* for loop to check how many seeds each player has in their pits */
    for (let i = 0; i < this.numberOfPits; i++) {
      seedsPlayer += this.pits[i];
      seedsOpponent += this.pits[i + this.numberOfPits + 1];
    } /* end of for loop to check for seeds in pits */

    /* check if either player has 0 seeds in their pits, to point that the game is over */
    if (seedsPlayer == 0 || seedsOpponent == 0) {
      if (
        seedsPlayer + seedsInStorePlayer >
        seedsOpponent + seedsInStoreOpponent
      )
        return [1, 10];
      if (
        seedsPlayer + seedsInStorePlayer ==
        seedsOpponent + seedsInStoreOpponent
      )
        return [1, 0];
      return [1, -10];
    } /* end of condition for end of gaming checking */

    /* check if the player will play again and evaluate considering the seeds in the stores */
    if (repeatOrNot == "storePlayer") {
      if (seedsInStorePlayer > seedsInStoreOpponent) return [0, 7];
      if (seedsInStorePlayer == seedsInStoreOpponent) return [0, 6];
      return [0, 5];
    } /* end of checking if the player will play again */
    /* check if the opponent will play again and evaluate considering the seeds in the stores */
    if (repeatOrNot == "storeOpponent") {
      if (seedsInStorePlayer > seedsInStoreOpponent) return [0, -5];
      if (seedsInStorePlayer == seedsInStoreOpponent) return [0, -6];
      return [0, -7];
    } /* end of checking if the opponent will play again */

    /* if neither plays again, evaluate only based on the amount of seeds in the stores */
    if (seedsInStorePlayer > seedsInStoreOpponent) return [0, 1];
    if (seedsInStorePlayer == seedsInStoreOpponent) return [0, 0];
    return [0, -1];
  } /* end of evaluate method */

  /* processes the game Move within the Object, given which pit it starts at, and the number of Seeds in it */
  gameMove(seedsInPit, pit) {
    const lastPlayed = {
      event: "nothing happened",
    };

    const offset = ((x) => {
      if (x == "Player") return 0;
      return this.storePlayerPosition + 1;
    })(
      this.turn
    ); /* creates an offset based on whether it's the Player's or the Opponent's turn, since the whole board is contained in a single list */

    this.pits[pit + offset] = 0;

    let remainingSeeds = seedsInPit;
    let currentPosition = pit;
    let relativePosition;

    /* processes the play while there are seeds to add to other pits */
    while (remainingSeeds > 0) {
      currentPosition++;
      relativePosition = (currentPosition + offset) % this.pits.length;

      /* verifies whether it's a pit that should be skipped, considering the current player
        If it's the Player, then only the Opponent's Store should be skipped.
        If it's the Opponent, then only the Player's Store should be skipped.
        */
      if (
        (offset == 0 && relativePosition == this.storeOpponentPosition) ||
        (offset != 0 && relativePosition == this.storePlayerPosition)
      ) {
        currentPosition++;
        relativePosition = (currentPosition + offset) % this.pits.length;
      } /* end of pit skip verification */

      const seedsInCurrentPit = this.pits[relativePosition];

      this.pits[relativePosition]++;

      remainingSeeds--;

      /* verifies what to do, when it was the last seed placed */
      if (remainingSeeds == 0) {
        /* 
            if the last seed was placed in the a Store, the respective player should repeat
            It's unnecessary to verify whether it was the Player or the Opponent playing, 
            since it's already given in the beginning of the loop, that the Opponent skips the Player's store and vice-versa
            */
        if (
          relativePosition == this.storePlayerPosition ||
          relativePosition == this.storeOpponentPosition
        ) {
          lastPlayed.event =
            relativePosition == this.storePlayerPosition
              ? "storePlayer"
              : "storeOpponent";
        } /* end of verifying if the last seed was placed in a Store */ else {
          /* if the last play wasn't in a Store ... */
          /* ... and previously the last seeded pit was empty ... */
          if (seedsInCurrentPit == 0) {
            /* ... if it was the Player and it was one of their pits, steal the Opponent's seeds */
            if (offset == 0 && relativePosition < this.storePlayerPosition) {
              this.pits[relativePosition]--;
              this.pits[this.storePlayerPosition]++;
              this.pits[this.storePlayerPosition] +=
                this.pits[2 * this.storePlayerPosition - relativePosition];
              this.pits[2 * this.storePlayerPosition - relativePosition] = 0;
              lastPlayed.event = "emptiedOpponentPit";
            } /* end of stealing Opponent's seeds */
            /* if it was the Opponent and it was one of their pits, steal the Player's seeds */
            if (offset != 0 && relativePosition > this.storePlayerPosition) {
              this.pits[relativePosition]--;
              this.pits[this.storeOpponentPosition]++;
              this.pits[this.storeOpponentPosition] +=
                this.pits[this.storeOpponentPosition - relativePosition];
              this.pits[this.storeOpponentPosition - relativePosition] = 0;
              lastPlayed.event = "emptiedPlayerPit";
            } /* end of stealing Player's seeds */
          } /* end of verifying if the last seeded pit was empty */
        } /* end of verifying if the last play wasn't in a Store */
      } /* end of last seed placed verification */
    } /* end of while loop */

    this.value = this.evaluateStatus(lastPlayed.event);

    /* if the move isn't flagged as a repeat, then switch turn to the other player */
    if (!lastPlayed.event.includes("store")) {
      this.turn = this.turn == "Player" ? "Opponent" : "Player";
    } /* end of checking if the move isn't flagged as a repeat */
  } /* end of game Move method */

  /* computers the Player's turn, given the element (pit) where the click occurred */
  playerTurn(element) {
    console.log(this);
    console.log("This is the Player's Turn");

    const pit = parseInt(element.id.slice(-1));

    console.log(pit);

    const seedsInPit = this.pits[pit];

    /* verifies if the Player didn't try an invalid play */
    if (seedsInPit == 0) {
      replaceGameMessages(
        "You can't select an empty pit to play. Please play again."
      );
    } /* end of verifying if the play was invalid */
    /* if the play was valid */
    else {
      this.gameMove(seedsInPit, pit);

      updateDisplay();

      this.evaluateNext();
    } /* end of actions if the play was valid */
  } /* end of Player's Turn method */

  opponentTurn() {
    console.log(this);
    console.log("This is the Opponent'sTurn");

    const bestchild = this.getMin();

    this.updateMancala(
      bestchild.pits,
      bestchild.turn,
      bestchild.value
    );

    updateDisplay();

    this.evaluateNext();
  }

  /* decides whether there's still a next step in the game, or if the game is over */
  evaluateNext() {
    /* if it's not game over */
    if (this.value[0] == 0) {
      /* if it's a repeat Play for the player */
      if ((this.value[1] >= 5 && this.value[1] <= 7) || (this.value[1] >= -7 && this.value[1] <= -5)) {
        replaceGameMessages("The " + this.turn + " may play again");
        if(this.turn == "Opponent") this.opponentTurn();
      } /* end of verifying if it's a repeat Play */
      /* if it isn't a repeat Play, then let the other player Play */
      else {
        replaceGameMessages("It is now the " + this.turn + "'s turn to play.");
        if(this.turn == "Opponent") this.opponentTurn();
      }
    } /* end of verifying if it's game over */
    /* if it is game over */
    else {
      /* if the Player won, print it */  
      if (this.value[1] == 10) {
        replaceGameMessages("The Game Is Over. Player Wins.");
        gamesWonByPlayer++;
        document.getElementById("playerScore").innerHTML = gamesWonByPlayer;
      } /* end of verifying if the Player won */
      /* if it's a Draw, print it */
      if (this.value[1] == 0) {
        replaceGameMessages("The Game Is Over. It's a Draw.");
      } /* end of verifying it's a Draw */
      /* if the Opponent won, print it */
      if (this.value[1] == -10) {
        gamesWonByPC++;
        document.getElementById("opponentScore").innerHTML = gamesWonByPC;
      } /* end of verifying if the Opponent won */
    } /* end of game over */
  } /* end of evaluateNext method */

  getMin(parent) {
    const length = parent.pits.length / 2;
    const children = new Array(length);
    for (let i = 0; i < length; i++) {
      children[i] = parent.copy();
      console.log(children[i]);

      children[i].gameMove(children[i].pits[i + length], i);
      if (
        children[i].value[0] == 0 &&
        !(children[i].value[1] >= -7 && children[i].value[1] <= -5)
      )
        children[i].turn = "Player";
      console.log(game);
      console.log(children[i]);
    }
    let bestchild = children[0].copy();
    for (let i = 1; i < length; i++) {
      if (children[i].value[1] < bestchild.value[1]) {
        bestchild = children[i].copy();
      }
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
}