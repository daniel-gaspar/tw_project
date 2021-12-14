"use strict";

const PORT = 8008;

const http = require("http");
const url = require("url");

const ranking = require("./ranking.js");
const register = require("./register.js");

const headers = {
    json: {
        'Content-Type': 'application/json;',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
    }
}

http.createServer(function (request, response) {
    const preq = url.parse(request.url, true);
    const pathname = preq.pathname;
    let answer = {};

    switch(request.method) {
        case 'GET':
            answer = doGet(pathname, request, response);
            break;
        case 'POST':
            answer = doPost(pathname);
            break;
        default:
            answer.status = 400;
            break;
    }

    if(answer.status === undefined) {
        answer.status = 200;
    }

    if(answer.style === undefined) {
        answer.style = 'json';
    }

    response.writeHead(answer.status, headers[answer.style]);
    if (answer.style === 'plain') {
        response.end();
    }

}).listen(PORT);

function doPost(pathname) {
    let answer = {};

    switch(pathname) {
        case '/register':
            break;
        case '/ranking':
            break;
        default:
            answer.status = 400;
            break;
    }

    return answer;

}