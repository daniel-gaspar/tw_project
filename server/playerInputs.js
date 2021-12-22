"use strict";

const crypto = require("crypto");

const groups = {};

module.exports.join = function (reqBody) {
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
    
  } else {
    return { error: "Invalid Arguments" };
  }
};
