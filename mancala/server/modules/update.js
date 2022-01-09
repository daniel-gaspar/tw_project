"use strict";

const responses = {};

const errormessages = require("./serverconf.js").errormessages;

const games = require("./serverconf.js").games;

function remember(response, gamehash) {
  if (!(gamehash in responses)) responses[gamehash] = [];
  responses[gamehash].push(response);
}

function forget(response, gamehash) {
  const pos = responses[gamehash].findIndex((resp) => resp === response);
  if (pos > -1) responses[gamehash].splice(pos, 1);
  if (gamehash in games) delete games[gamehash];
}

function update(gamehash) {
  for (let response of responses[gamehash]) {
    const data = {};
    if ("sides" in games[gamehash] && "turn" in games[gamehash]) {
      data.board = { sides: games[gamehash].sides, turn: games[gamehash].turn };
    }
    if ("winner" in games[gamehash]) {
      data.winner = games[gamehash].winner;
    }
    response.write("data: " + JSON.stringify(data) + "\n\n");
  }
}

module.exports = { remember, forget, update };
