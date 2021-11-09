function toggleElementDisplayOpen(elementId,openOrDisplay) {
  const x = document.getElementById(elementId);
  x.classList.toggle(openOrDisplay);
}

function startGame() {
  const numberOfPits = document.querySelector('input[name="settingsPitsRadio"]:checked').value;
  const initialSeedNumber = document.querySelector('input[name="numberSeeds"]').value;
  const difficultyAI = document.querySelector('select[name="difficultySelector"]').value;
  const gameStarter = document.querySelector('input[name="settingsFirstTurnRadio"]:checked').value;
  const game = new Mancala("gameBoard",numberOfPits,initialSeedNumber,difficultyAI,gameStarter);
}

class Mancala {
  constructor(parentId,numberOfPits,initialSeedNumber,difficultyAI,gameStarter) {
    this.parent = document.getElementById(parentId);
    this.numberOfPits = numberOfPits;
    this.difficultyAI = difficultyAI;
    this.turn = gameStarter;
    this.pitsPlayer = new Array(this.numberOfPits);
    this.pitsOpponent = new Array(this.numberOfPits);
    this.storePlayer = 0;
    this.storeOpponent = 0;

    const initialSeedNumberGame = initialSeedNumber;
    
    const storeOpponent = document.createElement("div");
    storeOpponent.className = "storeOpponent";
    this.parent.appendChild(storeOpponent);

    const gamePits = document.createElement("div");
    gamePits.className = "gamePits";
    this.parent.appendChild(gamePits);

    const gamePitsOpponent = document.createElement("div");
    gamePitsOpponent.className = "gamePitsOpponent";
    gamePits.appendChild(gamePitsOpponent);

    const gamePitsPlayer = document.createElement("div");
    gamePitsPlayer.className = "gamePitsPlayer";
    gamePits.appendChild(gamePitsPlayer);

    const storePlayer = document.createElement("div");
    storePlayer.className = "storePlayer";
    this.parent.appendChild(storePlayer);

    for( let i = 0; i < this.numberOfPits; i++) {
      this.pitsPlayer[i] = initialSeedNumberGame;
      this.pitsOpponent[i] = initialSeedNumberGame;
      
      let pitPlayer = document.createElement("div");
      pitPlayer.id = "pitPlayer" + (i+1);
      pitPlayer.className = "pitPlayer";
      gamePitsPlayer.appendChild(pitPlayer);

      let pitOpponent = document.createElement("div");
      pitOpponent.id = "pitOpponent" + (i+1);
      pitOpponent.className = "pitOpponent";
      gamePitsOpponent.appendChild(pitOpponent);

      for (let j = 0; j < initialSeedNumberGame; j++ ) {
        let seedOne = document.createElement("div");
        seedOne.className = "seed";
        const x = Math.floor(Math.random() * 25) + 10;
        const y = Math.floor(Math.random() * 25) + 10;
        seedOne.style.left = x + "%";
        seedOne.style.top = y + "%";
        pitPlayer.appendChild(seedOne);

        let seedTwo = document.createElement("div");
        seedTwo.className = "seed";
        const x2 = Math.floor(Math.random() * 25) + 10;
        const y2 = Math.floor(Math.random() * 25) + 10;
        seedTwo.style.left = x2 + "%";
        seedTwo.style.top = y2 + "%";
        pitOpponent.appendChild(seedTwo);
      }
    }
  }
}