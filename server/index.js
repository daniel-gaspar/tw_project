"use strict";

const http = require("http");
const path = require("path");
//const stream = require("stream");
const url = require("url");
const fs = require("fs");
const conf = require("./serverconf.js");
const updater = require("./update.js");
const joiner = require("./join.js");
const leaver = require("./leave.js");
const notifier = require("./notify.js");
const registerer = require("./register.js");
const rankinger = require("./ranking.js");

const headers = {
    sse: {
        'Content-Type':                 'text/event-stream',
        'Cache-Control':                'no-cache',
        'Access-Control-Allow-Origin':  '*',
        'Connection':                   'keep-alive'
    },
    json: {
        'Content-Type':                 'application/json;',
        'Cache-Control':                'no-cache',
        'Access-Control-Allow-Origin':  '*'
    }
}

http.createServer(async function (request, response) {
    const parsedURL = url.parse(request.url, true);
    const pathname = parsedURL.pathname;
    let answer = {};

    switch(request.method) {
        
        case 'GET':
            answer = doGet(pathname, request, response);
            break;
        case 'POST':
            
            const buffers = [];

            for await(const chunk of request) {
                buffers.push(chunk);
            }

            const reqBody = JSON.parse(Buffer.concat(buffers).toString());

            answer = doPost(pathname,reqBody);
            
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
    response.write(answer.body);
    if (answer.style === 'json') {
        response.end();
    }

}).listen(conf.PORT);

function doGet(pathname, request, response) {

}

function doPost(pathname,reqBody) {
    const answer = {};
    let data;
    
    switch(pathname) {
        
        case '/register':
            data = registerer.login(reqBody.nick,reqBody.password);
            answer.body = data;
            break;
        case '/ranking':
            data = rankinger.get();
            answer.body = JSON.stringify(data);
            break;
        case '/join':
            break;
        case '/notify':
            break;
        case '/leave':
            break;
        default:
            answer.status = 400;
            break;
    }

    return answer;

}