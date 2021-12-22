"use strict";

const http = require("http");
const url = require("url");
const conf = require("./serverconf.js");
const updater = require("./update.js");
const playerInputs = require("./playerInputs.js");
const basics = require("./basics.js");

const headers = {
  sse: {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Access-Control-Allow-Origin": "*",
    Connection: "keep-alive",
  },
  json: {
    "Content-Type": "application/json;",
    "Cache-Control": "no-cache",
    "Access-Control-Allow-Origin": "*",
  },
};

http
  .createServer(async function (request, response) {
    const parsedURL = url.parse(request.url, true);
    const pathname = parsedURL.pathname;
    let answer = {};

    switch (request.method) {
      case "GET":
        answer = doGet(pathname, request, response);
        break;
      case "POST":
        const buffers = [];

        for await (const chunk of request) {
          buffers.push(chunk);
        }

        const reqBody = JSON.parse(Buffer.concat(buffers).toString());

        answer = doPost(pathname, reqBody);

        break;
      default:
        answer.status = 404;
        break;
    }

    if (answer.status === undefined) {
      answer.status = 200;
    }

    if (answer.style === undefined) {
      answer.style = "json";
    }

    response.writeHead(answer.status, headers[answer.style]);
    response.write(answer.body);
    if (answer.style === "json") {
      response.end();
    }
  })
  .listen(conf.PORT);

function doGet(pathname, request, response) {}

function doPost(pathname, reqBody) {
  const answer = {};
  let data;

  switch (pathname) {
    case "/register":
      data = basics.login(reqBody);
      if ("error" in data) {
        if (data.error == "Invalid Arguments") {
          answer.status = 400;
        } else answer.status = 401;
      }
      answer.body = JSON.stringify(data);
      break;
    case "/ranking":
      data = basics.get(reqBody);
      if ("error" in data) {
        answer.status = 400;
      }
      answer.body = JSON.stringify(data);
      break;
    case "/join":
      data = playerInputs.join(reqBody);
      if ("error" in data) {
        answer.status = 400;
      }
      answer.body = JSON.stringify(data);
      break;
    case "/notify":
      break;
    case "/leave":
      break;
    default:
      answer.status = 404;
      break;
  }

  return answer;
}
