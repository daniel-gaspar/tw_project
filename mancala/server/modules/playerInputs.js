"use strict";

const crypto = require("crypto");
const encryption = require("./encryption.js");
const errormessages = require("./serverconf.js").errormessages;

const games = require("./serverconf.js").games;
const users = require("./serverconf.js").users;
const updater = require("./update.js");
const { gameMove } = require("./gamelogic.js");

function join(reqBody) {
  if (
    Object.keys(reqBody).length == 5 &&
    "nick" in reqBody &&
    "password" in reqBody &&
    "size" in reqBody &&
    "initial" in reqBody &&
    "group" in reqBody
  ) {
    const nick = reqBody.nick;
    const password = reqBody.password;
    const size = reqBody.size;
    const initial = reqBody.initial;
    const group = reqBody.group;

    if (nick in users) {
      if (encryption.verify(users[nick], password)) {
        const gamehash = crypto
          .createHash("md5")
          .update(JSON.stringify({ initial, size, group }))
          .digest("hex");
        if (gamehash in games) {
          if (games[gamehash].players.length == 1) {
            games[gamehash].players.push(nick);
            const player1 = games[gamehash].players[0];
            const player2 = games[gamehash].players[1];
            games[gamehash].sides = {};
            games[gamehash].sides[player1] = {
              store: 0,
              pits: Array(size).fill(initial),
            };
            games[gamehash].sides[player2] = {
              store: 0,
              pits: Array(size).fill(initial),
            };
            games[gamehash].turn =
              games[gamehash].players[Math.round(Math.random())];
          } else {
            return { error: errormessages["overflow"] };
          }
        } else {
          games[gamehash] = {
            players: [nick],
            size,
            initial,
          };
        }
        return { game: gamehash };
      } else {
        return { error: errormessages["login"] };
      }
    } else {
      return { error: errormessages["notuser"] };
    }
  } else {
    return { error: errormessages["arguments"] };
  }
}

function notify(reqBody) {
  if (
    Object.keys(reqBody).length == 4 &&
    "nick" in reqBody &&
    "password" in reqBody &&
    "game" in reqBody &&
    "move" in reqBody
  ) {
    const nick = reqBody.nick;
    const password = reqBody.password;
    const game = reqBody.game;
    const move = reqBody.move;
    if (nick in users) {
      if (encryption.verify(users[nick], password)) {
        if (game in games) {
          if (games[game].turn == nick) {
            if (move >= 0 && move < games[game].size) {
              gameMove(game, nick, move);
              updater.update(game);
              return {};
            } else {
              return { error: errormessages["invalidmove"] };
            }
          } else {
            return { error: errormessages["notturn"] };
          }
        } else {
          return { error: errormessages["invalidgame"] };
        }
      } else {
        return { error: errormessages["login"] };
      }
    } else {
      return { error: errormessages["notuser"] };
    }
  } else {
    return { error: errormessages["arguments"] };
  }
}

function leave(reqBody) {
  if (
    Object.keys(reqBody).length == 3 &&
    "nick" in reqBody &&
    "password" in reqBody &&
    "game" in reqBody
  ) {
    const nick = reqBody.nick;
    const password = reqBody.password;
    const game = reqBody.game;
    if (nick in users) {
      if (encryption.verify(users[nick], password)) {
        if (game in games) {
          if (games[game].players.length == 1) {
            games[game].winner = null;
          } else
            games[game].winner =
              games[game].player[0] == nick
                ? games[game].player[1]
                : games[game].player[0];
          updater.update(gamehash);
          return {};
        } else {
          return { error: errormessages["invalidgame"] };
        }
      } else {
        return { error: errormessages["login"] };
      }
    } else {
      return { error: errormessages["notuser"] };
    }
  } else {
    return { error: errormessages["arguments"] };
  }
}

module.exports = { join, notify, leave };
