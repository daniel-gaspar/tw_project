"use strict";

const crypto = require("crypto");
const errormessages = require("./serverconf.js").errormessages;

const groups = require("./serverconf.js").groups;

function join(reqBody) {
  if (Object.keys(reqBody).length == 5 &&
    "nick" in reqBody &&
    "password" in reqBody &&
    "size" in reqBody &&
    "initial" in reqBody &&
    "group" in reqBody) {
    const nick = reqBody.nick;
    const password = reqBody.password;
    const size = reqBody.size;
    const initial = reqBody.initial;
    const group = reqBody.group;

    if (nick in users) {
      if (encryption.verify(users[nick], password)) {
        if (group in groups) {
          if (groups[group].players.length == 1) {
            if (groups[group].size == size &&
              groups[group].initial == initial) {
              groups[group].players.push(nick);
            } else {
              return { error: errormessages["invalidconfig"] };
            }
          } else {
            return { error: errormessages["overflow"] };
          }
        } else {
          groups[group] = {
            players: [].push(nick),
            size,
            initial,
            game: crypto
              .createHash("md5")
              .update(parseToInt(group))
              .digest("hex"),
          };
        }
        return { game: groups[group].game };
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

function notify(reqBody){

}

function leave(reqBody) {
}

module.exports = { join, notify, leave };