"use strict";

const fs = require("fs");
const encryption = require("./encryption.js")
const usersFile = './storage/users.txt';
const encoding = 'utf8';

const users = {};

fs.readFile(usersFile,encoding, function(err,data) {
    if(! err) {
        const parsedUsers = JSON.parse(data);
        for (let user in parsedUsers) {
            users[user] = parsedUsers[user];
        }
    }
    if (err) {
        console.log("error"+err);
    }});

module.exports.login = function(nick,password) {
    if(nick in users) {
        if (encryption.verify(users[nick],password)) {
            return '{}';
        }
        return '{"error": "User registered with a different password" }';
    }
    else {
        const encryptedPassword = encryption.encrypt(password);
        users[nick] = encryptedPassword;

        fs.writeFile(usersFile, JSON.stringify(users), encoding, function (err) {if(err) console.log("error in writing to userfile");})

        return '{}';

    }
};