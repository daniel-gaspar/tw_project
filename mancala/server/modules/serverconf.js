"use strict";
const documentRoot = "/home/dgaspar/aulasp/tw/tw_project/mancala";
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

const headers = {
  sse: {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Access-Control-Allow-Origin": "*",
    "Connection": "keep-alive",
    "Transfer-Encoding": "chunked",
  },
  json: {
    "Content-Type": "application/json;",
    "Cache-Control": "no-cache",
    "Access-Control-Allow-Origin": "*",
  },
  plain: {
    "Content-Type": "application/javascript",
    "Cache-Control": "no-cache",
    "Access-Control-Allow-Origin": "*",
  },
};

const errormessages = {
  arguments: "Invalid Arguments",
  login: "User registered with a different password",
  notuser: "This nick isn't registered",
  invalidconfig: "This group has a different game configuration",
  overflow: "There are already two players for this group",
  invalidgame: "Invalid game reference",
  notturn: "Not your turn to play",
  invalidmove: "Invalid move",
};

const rankings = {};
const users = {};
const rankingsFile = "./server/storage/rankings.txt";
const usersFile = "./server/storage/users.txt";
const games = {};

module.exports = {
  documentRoot,
  defaultIndex,
  PORT,
  mediaTypes,
  headers,
  errormessages,
  rankings,
  users,
  rankingsFile,
  usersFile,
  games,
};
