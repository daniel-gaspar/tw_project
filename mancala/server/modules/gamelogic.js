"use strict";

const games = require("./serverconf.js").games;

function gameMove(gamehash,nick,move) {
    let remainingSeeds = games[gamehash].sides[nick].pits[move];
    const numberOfPits = games[gamehash].size;

    let currentSide = nick;

    let currentPosition = move;

    while (remainingSeeds > 0) {
        let seedsInCurrentPit;
        currentPosition++;
        if(currentPosition == numberOfPits) {
           if (currentSide == nick) { games[gamehash].sides[nick].store++; currentPosition = -1; }
           else { games[gamehash].sides[nick].pits[0]++; currentPosition = 0; }
           currentSide = currentSide == games[gamehash].players[0] ? games[gamehash].players[1] : games[gamehash].players[0];
        }
        else {
            seedsInCurrentPit = games[gamehash].sides[currentSide].pits[currentPosition];
            games[gamehash].sides[currentSide].pits[currentPosition]++;
        }

        remainingSeeds--;

        if(remainingSeeds == 0) {
            
        }


    }


}