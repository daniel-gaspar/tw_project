"use strict";

module.exports.defaultIndex = 'index.html';
module.exports.PORT = 8166;
module.exports.mediaTypes = {
    'txt':      'text/plain',
    'html':     'text/html',
    'css':      'text/css',
    'js':       'application/javascript',
    'png':      'image/png',
    'jpeg':     'image/jpeg',
    'jpg':      'image/jpeg'
};

module.exports.errormessages = {
    arguments: "Invalid Arguments",
    login: "User registered with a different password",
    notuser: "This nick isn't registered",
    invalidconfig: "This group has a different game configuration",
    overflow: "There are already two players for this group",
    invalidgame: "Invalid game reference",
    notturn: "Not your turn to play",
    invalidmove: "invalid move"
}

module.exports.rankings = {};
module.exports.users = {};
module.exports.rankingsFile = "./storage/rankings.txt";
module.exports.usersFile = "./storage/users.txt";
module.exports.groups = {};