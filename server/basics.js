"use strict";

const fs = require("fs");
const encryption = require("./encryption.js");

const rankings = {};
const users = {};
const rankingsFile = "./storage/rankings.txt";
const usersFile = "./storage/users.txt";

const encoding = "utf8";

fs.readFile(rankingsFile, encoding, function (err, data) {
  if (!err) {
    rankings.ranking = JSON.parse(data).ranking;
  }
  if (err) {
    console.log("error" + err);
  }
});

fs.readFile(usersFile, encoding, function (err, data) {
    if (!err) {
      const parsedUsers = JSON.parse(data);
      for (let user in parsedUsers) {
        users[user] = parsedUsers[user];
      }
    }
    if (err) {
      console.log("error" + err);
    }
  });

module.exports.get = function (reqBody) {
  if (Object.keys(reqBody).length == 0) {
    return rankings;
  } else {
    return { error: "Invalid Arguments" };
  }
};

module.exports.login = function (reqBody) {
  if (Object.keys(reqBody).length == 2 && "nick" in reqBody && "password" in reqBody) {
    const nick = reqBody.nick;
    const password = reqBody.password;

    if (nick in users) {
      if (encryption.verify(users[nick], password)) {
        return {};
      }
      return { error: "User registered with a different password" };
    } else {
      const encryptedPassword = encryption.encrypt(password);
      users[nick] = encryptedPassword;

      fs.writeFile(usersFile, JSON.stringify(users), encoding, function (err) {
        if (err) console.log("error in writing to userfile");
      });

      return {};
    }
  } else {
    return { error: "Invalid Arguments" };
  }
};