"use strict";

const games = require("./serverconf.js").games;

function gameMove(gamehash, nick, move) {
  const player1 = games[gamehash].players[0];
  const player2 = games[gamehash].players[1];

  let remainingSeeds = games[gamehash].sides[nick].pits[move];
  games[gamehash].sides[nick].pits[move] = 0;
  const numberOfPits = games[gamehash].size;

  let currentSide = nick;

  let currentPosition = move;

  while (remainingSeeds > 0) {
    let seedsInCurrentPit;
    currentPosition++;
    if (currentPosition == numberOfPits) {
      if (currentSide == nick) {
        games[gamehash].sides[nick].store++;
        currentPosition = -1;
      } else {
        games[gamehash].sides[nick].pits[0]++;
        currentPosition = 0;
      }
      currentSide = currentSide == player1 ? player2 : player1;
    } else {
      seedsInCurrentPit =
        games[gamehash].sides[currentSide].pits[currentPosition];
      games[gamehash].sides[currentSide].pits[currentPosition]++;
    }

    remainingSeeds--;

    if (remainingSeeds == 0) {
      if (currentPosition != -1) {
        games[gamehash].turn = player1 == nick ? player2 : player1;
      }
      if (currentSide == nick && seedsInCurrentPit == 0) {
        const opponent = player1 == nick ? player2 : player1;
        const oppositePit = numberOfPits - currentPosition - 1;
        games[gamehash].sides[nick].store++;
        games[gamehash].sides[nick].pits[currentPosition] = 0;
        games[gamehash].sides[nick].store +=
          games[gamehash].sides[opponent].pits[oppositePit];
        games[gamehash].sides[opponent].pits[oppositePit] = 0;
      }
    }
  }

  let seedsPlayer1 = 0;
  let seedsPlayer2 = 0;

  for (let i = 0; i < numberOfPits; i++) {
    seedsPlayer1 += games[gamehash].sides[player1].pits[i];
    seedsPlayer2 += games[gamehash].sides[player2].pits[i];
  }

  if (seedsPlayer1 == 0 || seedsPlayer2 == 0) {
    for (let i = 0; i < numberOfPits; i++) {
      games[gamehash].sides[player1].store +=
        games[gamehash].sides[player1].pits[i];
      games[gamehash].sides[player1].pits[i] = 0;
      games[gamehash].sides[player2].store +=
        games[gamehash].sides[player2].pits[i];
      games[gamehash].sides[player2].pits[i] = 0;
    }

    const finalSeedsInStorePlayer1 = games[gamehash].sides[player1].store;
    const finalSeedsInStorePlayer2 = games[gamehash].sides[player2].store;

    if (finalSeedsInStorePlayer1 > finalSeedsInStorePlayer2) {
      games[gamehash].winner = player1;
    }
    if (finalSeedsInStorePlayer1 < finalSeedsInStorePlayer2) {
      games[gamehash].winner = player2;
    }
    if (finalSeedsInStorePlayer1 == finalSeedsInStorePlayer2) {
      games[gamehash].winner = null;
    }
  }
}

module.exports = { gameMove };
