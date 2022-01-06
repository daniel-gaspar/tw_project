"use strict";
const documentRoot = "/home/dgaspar/aulasp/tw/tw_project/mancala"
const defaultIndex = "index.html";
const PORT = 8166;
const mediaTypes = {
  txt: "text/plain",
  html: "text/html",
  css: "text/css",
  js: "application/javascript",
  png: "image/png",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
};

const errormessages = {
  arguments: "Invalid Arguments",
  login: "User registered with a different password",
  notuser: "This nick isn't registered",
  invalidconfig: "This group has a different game configuration",
  overflow: "There are already two players for this group",
  invalidgame: "Invalid game reference",
  notturn: "Not your turn to play",
  invalidmove: "invalid move",
};

const rankings = {};
const users = {};
const rankingsFile = "./server/storage/rankings.txt";
const usersFile = "./server/storage/users.txt";
const groups = {};

module.exports = {
  documentRoot,
  defaultIndex,
  PORT,
  mediaTypes,
  errormessages,
  rankings,
  users,
  rankingsFile,
  usersFile,
  groups,
};
