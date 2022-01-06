"use strict";

const http = require("http");
const url = require("url");
const conf = require("./server/modules/serverconf.js");
const updater = require("./server/modules/update.js");
const playerInputs = require("./server/modules/playerInputs.js");
const basics = require("./server/modules/basics.js");
const errormessages = require("./server/modules/serverconf.js").errormessages;

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
      break;
    case "/ranking":
      data = basics.get(reqBody);
      break;
    case "/join":
      data = playerInputs.join(reqBody);
      break;
    case "/notify":
      break;
    case "/leave":
      break;
    default:
      answer.status = 404;
      break;
  }

  answer.body = JSON.stringify(data);

  if ("error" in data) {
    switch (data.error) {
      case errormessages["login"]:
        answer.status = 401;
        break;
      default:
        answer.status = 400;
        break;
    }
  }

  return answer;
}
