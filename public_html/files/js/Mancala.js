"use strict";

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
    this.nick = 'dgaspar';
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
    gameValueStatus = this.value,
    numberOfPitsStatus = this.numberOfPits,
    storePlayerPositionStatus = this.storePlayerPosition,
    storeOpponentPositionStatus = this.storeOpponentPosition,
    difficultyAIStatus = this.difficultyAI
  ) {
    this.numberOfPits = numberOfPitsStatus;

    this.pits = pitsStatus.slice();

    this.pits[storePlayerPositionStatus] = 0;

    this.pits[storeOpponentPositionStatus] = 0;

    this.storePlayerPosition = storePlayerPositionStatus;

    this.storeOpponentPosition = storeOpponentPositionStatus;

    this.difficultyAI = difficultyAIStatus;

    this.turn = gameTurnStatus;

    this.value = gameValueStatus.slice();
  } /* end of the update method */

  updateFromBoard(board) {
    const offset = this.numberOfPits+1;

    this.pits[this.storePlayerPosition] = board.sides[this.nick].store;
    this.pits[this.storeOpponentPosition] = board.sides[this.nickOpponent].store;
    for(let i=0; i<this.numberOfPits; i++) {
      this.pits[i] = board.sides[this.nick].pits[i];
      this.pits[i+offset] = board.sides[this.nickOpponent].pits[i];
    }
    this.turn = (board.turn == this.nick) ? "Player" : "Opponent";

    replaceGameMessages("It is " + board.turn + "'s turn to play.");

    updateDisplay();
  }

  /* returns a value for the current status of the game, depending on the current this.pits configuration (and whether there's anyone playing again) */
  evaluateStatus(repeatOrNot) {
    let seedsPlayer = 0;
    let seedsOpponent = 0;

    const seedsInStorePlayer = this.pits[this.storePlayerPosition];
    const seedsInStoreOpponent = this.pits[this.storeOpponentPosition];

    const offset = this.numberOfPits + 1;

    /* for loop to check how many seeds each player has in their pits */
    for (let i = 0; i < this.numberOfPits; i++) {
      seedsPlayer += this.pits[i];
      seedsOpponent += this.pits[i + offset];
    } /* end of for loop to check for seeds in pits */

    /* check if either player has 0 seeds in their pits, to point that the game is over */
    if (seedsPlayer == 0 || seedsOpponent == 0) {
      for (let i = 0; i < this.numberOfPits; i++) {
        this.pits[this.storePlayerPosition] += this.pits[i];
        this.pits[i] = 0;
        this.pits[this.storeOpponentPosition] +=
          this.pits[i + offset];
        this.pits[i + offset] = 0;
      }
      if (
        this.pits[this.storePlayerPosition] >
        this.pits[this.storeOpponentPosition]
      )
        return [1, Mancala.WINNING_SCORE];
      if (
        this.pits[this.storePlayerPosition] ==
        this.pits[this.storeOpponentPosition]
      )
        return [1, Mancala.SAME_NUMBER];
      return [1, Mancala.LOSING_SCORE];
    } /* end of condition for end of gaming checking */

    /* check if the player will play again and evaluate considering the seeds in the stores */
    if (repeatOrNot == "storePlayer") {
      if (seedsInStorePlayer > seedsInStoreOpponent)
        return [0, Mancala.PLAYER_HIGHER_NUMBER_AND_REPEAT];
      if (seedsInStorePlayer == seedsInStoreOpponent)
        return [0, Mancala.PLAYER_SAME_NUMBER_AND_REPEAT];
      return [0, Mancala.PLAYER_LOWER_NUMBER_AND_REPEAT];
    } /* end of checking if the player will play again */
    /* check if the opponent will play again and evaluate considering the seeds in the stores */
    if (repeatOrNot == "storeOpponent") {
      if (seedsInStorePlayer > seedsInStoreOpponent)
        return [0, Mancala.OPPONENT_LOWER_NUMBER_AND_REPEAT];
      if (seedsInStorePlayer == seedsInStoreOpponent)
        return [0, Mancala.OPPONENT_SAME_NUMBER_AND_REPEAT];
      return [0, Mancala.OPPONENT_HIGHER_NUMBER_AND_REPEAT];
    } /* end of checking if the opponent will play again */

    /* if neither plays again, evaluate only based on the amount of seeds in the stores */
    if (seedsInStorePlayer > seedsInStoreOpponent) {
      this.turn = this.turn == "Player" ? "Opponent" : "Player";
      return [0, Mancala.PLAYER_HIGHER_NUMBER];
    }
    if (seedsInStorePlayer == seedsInStoreOpponent) {
      this.turn = this.turn == "Player" ? "Opponent" : "Player";
      return [0, Mancala.SAME_NUMBER];
    }
    this.turn = this.turn == "Player" ? "Opponent" : "Player";
    return [0, Mancala.OPPONENT_HIGHER_NUMBER];
  } /* end of evaluate method */

  /* processes the game Move within the Object, given which pit it starts at, and the number of Seeds in it */
  gameMove(seedsInPit, pit) {
    const lastPlayed = {
      event: "nothing happened",
    };

    /* creates an offset based on whether it's the Player's or the Opponent's turn, since the whole board is contained in a single list */
    const offset = this.turn == "Player" ? 0 : this.storePlayerPosition + 1;

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
                this.pits[2 * this.storePlayerPosition - relativePosition];
              this.pits[2 * this.storePlayerPosition - relativePosition] = 0;
              lastPlayed.event = "emptiedPlayerPit";
            } /* end of stealing Player's seeds */
          } /* end of verifying if the last seeded pit was empty */
        } /* end of verifying if the last play wasn't in a Store */
      } /* end of last seed placed verification */
    } /* end of while loop */

    this.value = this.evaluateStatus(lastPlayed.event);
  } /* end of game Move method */

  /* computes the Player's turn, given the element (pit) where the click occurred */
  playerTurn(pit) {
    const seedsInPit = this.pits[pit];

    /* verifies if the Player didn't try an invalid play */
    if (seedsInPit == 0) {
      replaceGameMessages(
        "You can't select an empty pit to play. Please play again."
      );
    } /* end of verifying if the play was invalid */ else {
      /* if the play was valid */
      this.gameMove(seedsInPit, pit);

      this.evaluateNext();
    } /* end of actions if the play was valid */
  } /* end of Player's Turn method */

  /* computes the Opponent's turn, with MinMax */
  opponentTurn() {
    const bestchild = this.getMin(1);

    const pit = bestchild[0];
    const seedsInPit = this.pits[pit + this.numberOfPits + 1];

    this.gameMove(seedsInPit, pit);

    this.evaluateNext();
  } /* end of Opponent's Turn method */

  /* decides whether there's still a next step in the game, or if the game is over */
  evaluateNext() {
    /* if it's not game over */
    if (this.value[0] == 0) {
      /* if it's a repeat Play for the player */
      if (
        this.value[1] == Mancala.PLAYER_HIGHER_NUMBER_AND_REPEAT ||
        this.value[1] == Mancala.PLAYER_SAME_NUMBER_AND_REPEAT ||
        this.value[1] == Mancala.PLAYER_LOWER_NUMBER_AND_REPEAT ||
        this.value[1] == Mancala.OPPONENT_HIGHER_NUMBER_AND_REPEAT ||
        this.value[1] == Mancala.OPPONENT_SAME_NUMBER_AND_REPEAT ||
        this.value[1] == Mancala.OPPONENT_LOWER_NUMBER_AND_REPEAT
      ) {
        replaceGameMessages("The " + this.turn + " may play again");
        if (this.turn == "Opponent") this.opponentTurn();
        else updateDisplay();
      } /* end of verifying if it's a repeat Play */ else {
        /* if it isn't a repeat Play, then let the other player Play */
        replaceGameMessages("It is now the " + this.turn + "'s turn to play.");
        if (this.turn == "Opponent") this.opponentTurn();
        else updateDisplay();
      }
    } /* end of verifying if it's game over */ else {
      /* if it is game over */
      /* if the Player won, print it */

      let posPlayer;
      let posComputer;

      for (let i = 0; i < offlineRankings.length ; i++) {
        if (offlineRankings[i].nick == this.nick) posPlayer = i;
        if (offlineRankings[i].nick == 'computer') posComputer = i;
      }

      if (posPlayer == null) {
        posPlayer = offlineRankings.length;
        offlineRankings[posPlayer] = {nick: this.nick, victories: 0, games: 0};
      }

      if (this.value[1] == Mancala.WINNING_SCORE) {
        replaceGameMessages("The Game Is Over. Player Wins.");
        offlineRankings[posPlayer].victories++;
        //gamesWonByPlayer++;
        //document.getElementById("playerScore").innerHTML = gamesWonByPlayer;
      } /* end of verifying if the Player won */
      /* if it's a Draw, print it */
      if (this.value[1] == Mancala.SAME_NUMBER) {
        replaceGameMessages("The Game Is Over. It's a Draw.");
      } /* end of verifying it's a Draw */
      /* if the Opponent won, print it */
      if (this.value[1] == Mancala.LOSING_SCORE) {
        replaceGameMessages("The Game Is Over. Opponent Wins.");
        offlineRankings[posComputer].victories++;
        //gamesWonByPC++;
        //document.getElementById("opponentScore").innerHTML = gamesWonByPC;
      } /* end of verifying if the Opponent won */

      offlineRankings[posPlayer].games++;
      offlineRankings[posComputer].games++;

      sortOfflineRankings();
      updateRankingsTable('offline',offlineRankings);

      updateDisplay();
    } /* end of game over */
  } /* end of evaluateNext method */

  /* returns the child with the Minimum Score */
  getMin(depth) {
    const children = [];
    const offset = this.numberOfPits+1;
    /* for loop to create a new Mancala Object for each possible play, and proceeds on it */
    for (let i = 0; i < this.numberOfPits; i++) {
      children[i] = this.copy();
      if (children[i].pits[i + offset] > 0) {
        children[i].gameMove(children[i].pits[i + offset], i);
      } else {
        children[i] = null;
      }
    } /* end of for loop */

    /* checks if the depth already matches the difficulty. If it doesn't,
      use getMin and getMax on children */
    if (!(depth == this.difficultyAI)) {
      /* for each child, if it's a pleyer's turn, use the getMax method, otherwise, use the getMin method */
      for (let i = 0; i < this.numberOfPits; i++) {
        if (children[i] != null) {
          if (children[i].value[0] == 0) {
            if (children[i].turn == "Player") {
              children[i].bestChild = children[i].getMax(depth + 1);
            }
          } else {
            children[i].bestChild = children[i].getMin(depth + 1);
          }
        }
      } /* end of for loop of getMin and getMax */
    } /* end of checking if depth already matches the difficulty */

    const bestchild = [0, 0, 9999];

    /* for loop to check which child has the lowest value */
    for (let i = 0; i < this.numberOfPits; i++) {
      if (children[i] != null) {
        if (children[i].bestChild != null) {
          if (children[i].bestChild[2] < bestchild[2]) {
            bestchild[0] = i;
            bestchild[1] = children[i].bestChild[1];
            bestchild[2] = children[i].bestChild[2];
          }
        } else {
          if (children[i].value[1] < bestchild[2]) {
            bestchild[0] = i;
            bestchild[1] = children[i].value[0];
            bestchild[2] = children[i].value[1];
          }
        }
      }
      /* end of foor loop checking lowest value */
    }
    return bestchild.slice();
  } /* end of getMin method */

  /* returns the child with the Maximum score */
  getMax(depth) {
    const children = [];
    /* for loop to create a new Mancala Object for each possible play, and proceeds on it */
    for (let i = 0; i < this.numberOfPits; i++) {
      children[i] = this.copy();
      if (children[i].pits[i] > 0) {
        children[i].gameMove(children[i].pits[i], i);
      } else {
        children[i] = null;
      }
    } /* end of for loop */

    /* checks if the depth already matches the difficulty. If it doesn't,
      use getMin and getMax on children */
    if (!(depth == this.difficultyAI)) {
      /* for each child, if it's a pleyer's turn, use the getMax method, otherwise, use the getMin method */
      for (let i = 0; i < this.numberOfPits; i++) {
        if (children[i] != null) {
          if (children[i].value[0] == 0) {
            if (children[i].turn == "Player") {
              children[i].bestChild = children[i].getMax(depth + 1);
            }
          } else {
            children[i].bestChild = children[i].getMin(depth + 1);
          }
        }
      } /* end of checking if depth already matches the difficulty */

      const bestchild = [0, 0, -9999];

      /* for loop to check which child has the highest value */
      for (let i = 0; i < this.numberOfPits; i++) {
        if (children[i] != null) {
          if (children[i].bestChild != null) {
            if (children[i].bestChild[2] > bestchild[2]) {
              bestchild[0] = i;
              bestchild[1] = children[i].bestChild[1];
              bestchild[2] = children[i].bestChild[2];
            }
          } else {
            if (children[i].value[1] > bestchild[2]) {
              bestchild[0] = i;
              bestchild[1] = children[i].value[0];
              bestchild[2] = children[i].value[1];
            }
          }
        }
      } /* end of foor loop checking highest value */
      return bestchild.slice();
    } /* end of for loop of getMin and getMax */
  } /* end of getMax method */

  /* A list of static methods to make scores textual */
  static get WINNING_SCORE() {
    return 100;
  }
  static get PLAYER_HIGHER_NUMBER_AND_REPEAT() {
    return 70;
  }
  static get PLAYER_HIGHER_NUMBER() {
    return 60;
  }
  static get PLAYER_SAME_NUMBER_AND_REPEAT() {
    return 50;
  }
  static get PLAYER_LOWER_NUMBER_AND_REPEAT() {
    return 40;
  }
  static get SAME_NUMBER() {
    return 0;
  }
  static get OPPONENT_LOWER_NUMBER_AND_REPEAT() {
    return -40;
  }
  static get OPPONENT_SAME_NUMBER_AND_REPEAT() {
    return -50;
  }
  static get OPPONENT_HIGHER_NUMBER() {
    return -60;
  }
  static get OPPONENT_HIGHER_NUMBER_AND_REPEAT() {
    return -70;
  }
  static get LOSING_SCORE() {
    return -100;
  } /* end of static methods */
}
