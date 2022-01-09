"use strict";

const http = require("http");
const path = require("path");
const url = require("url");
const fs = require("fs");
const conf = require("./server/modules/serverconf.js");
const updater = require("./server/modules/update.js");
const playerInputs = require("./server/modules/playerInputs.js");
const basics = require("./server/modules/basics.js");
const errormessages = require("./server/modules/serverconf.js").errormessages;

http
  .createServer(async function (request, response) {
    const parsedURL = url.parse(request.url, true);
    const pathname = parsedURL.pathname;
    let answer = {};

    switch (request.method) {
      case "GET":
        doGet(request, response);
        break;
      case "POST":
        const buffers = [];

        for await (const chunk of request) {
          buffers.push(chunk);
        }

        const reqBody = JSON.parse(Buffer.concat(buffers).toString());

        doPost(pathname, reqBody, response);
        break;
      default:
        answer.status = 404;
        break;
    }

    //if (answer.status === undefined) answer.status = 200;
    //if (answer.style === undefined) answer.style = "plain";

    //response.writeHead(answer.status, headers[answer.style]);
    //if (answer.style === "plain") response.end();
  })
  .listen(conf.PORT);

function doGet(request, response) {
  const pathname = getPathname(request);
  if (pathname === null) {
    response.writeHead(403); // Forbidden
    response.end();
  } else if (pathname == "/home/dgaspar/aulasp/tw/tw_project/mancala/update") {
    const query = url.parse(request.url,true).query;
    if ("nick" in query && "game" in query) {
      const nick = query.nick;
      const gamehash = query.game;
      if (nick in conf.users) {
        if(gamehash in conf.games) {
          response.writeHead(200, conf.headers["sse"]);
          updater.remember(response,gamehash);
          request.on('close', () => updater.forget(response,gamehash));
          setImmediate(() => updater.update(gamehash));
        } else {

        }
      } else {

      }
    }
    else {

    }
  } else {
    fs.stat(pathname, (err, stats) => {
      if (err) {
        response.writeHead(500); // Internal Server Error
        response.end();
      } else if (stats.isDirectory()) {
        if (pathname.endsWith("/"))
          doGetPathname(pathname + conf.defaultIndex, response);
        else {
          response.writeHead(
            301, // Moved Permanently
            { Location: pathname + "/" }
          );
          response.end();
        }
      } else doGetPathname(pathname, response);
    });
  }
}

function getPathname(request) {
  const purl = url.parse(request.url, true);
  let pathname = path.normalize(conf.documentRoot + purl.pathname);

  if (!pathname.startsWith(conf.documentRoot)) pathname = null;

  return pathname;
}

function doGetPathname(pathname, response) {
  const mediaType = getMediaType(pathname);
  const encoding = isText(mediaType) ? "utf8" : null;

  fs.readFile(pathname, encoding, (err, data) => {
    if (err) {
      response.writeHead(404); // Not Found
      response.end();
    } else {
      response.writeHead(200, { "Content-Type": mediaType });
      response.end(data);
    }
  });
}

function getMediaType(pathname) {
  const pos = pathname.lastIndexOf(".");
  let mediaType;

  if (pos !== -1) mediaType = conf.mediaTypes[pathname.substring(pos + 1)];

  if (mediaType === undefined) mediaType = "text/plain";
  return mediaType;
}

function isText(mediaType) {
  if (mediaType.startsWith("image")) return false;
  else return true;
}

function doPost(pathname, reqBody, response) {
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
      data = playerInputs.notify(reqBody);
      break;
    case "/leave":
      data = playerInputs.leave(reqBody);
      break;
    default:
      answer.status = 404;
      break;
  }

  if (answer.status === undefined) {
    answer.status = 200;
  }
  answer.body = JSON.stringify(data);
  answer.style = "json";

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

  response.writeHead(answer.status, conf.headers[answer.style]);
  response.write(answer.body);
  if (answer.style === "json") {
    response.end();
  }

  //return answer;
}
