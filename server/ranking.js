"use strict";

const fs = require("fs");

const rankings = {};

const rankingsFile = './storage/rankings.txt';

const encoding = 'utf8';

fs.readFile(rankingsFile,encoding, function(err,data) {
    if(! err) {
        rankings.ranking = JSON.parse(data).ranking;
    }
    if (err) {
        console.log("error"+err);
    }});

module.exports.get = function() { return rankings; };
