("use strict");

const serverurl = "http://twserver.alunos.dcc.fc.up.pt:8008/";

/* Sends Server a request for the ranking, converts JSON into object and visualize */
async function ranking() {
  const object = mkObject({});

  const getFetchResult = await getfetch("ranking", object);

  console.log(getFetchResult);
} /* end of ranking function */

/* Retrieves nick and password, sends Server a request.
Display eventual errors in message box */
async function register(nick = "dgaspar", password = "123456789") {
  const object = mkObject({ nick, password });

  const getFetchResult = await getfetch("register", object);

  if (!("error" in getFetchResult)) {
    document.getElementById("serverMessages").innerHTML =
      "Welcome " + nick + "!";
    game.onlineStatus = "LoggedIn";
    game.nick = nick;
    game.password = password;
  }

  console.log(getFetchResult);
} /* end of register function */

/* Retrieves nick and password, sends Server a request.
Display eventual errors in message box */
async function join(nick, password, size, initial, group = "999") {
  const object = mkObject({ nick, password, size, initial, group });

  const getFetchResult = await getfetch("join", object);

  if(!('error' in getFetchResult)) {
      game.hash = getFetchResult.game;
      game.statusPair = "Pairing";
      update(game.nick,game.hash);
  }

  console.log(getFetchResult);
} /* end of join function */

/* Retrieves nick, pass and game, sends Server a request.
Display eventual errors in message box */
async function leave(nick, password, game) {
  const object = mkObject({ nick, password, game });

  const getFetchResult = await getfetch("leave", object);

  console.log(getFetchResult);
} /* end of leave function */

/*
 */
async function notify(nick, pass, game, move) {
  const object = mkObject({ nick, password, game, move });

  const getFetchResult = await getfetch("notify", object);

  console.log(getFetchResult);
} /* end of notify function */

/*
 */
async function update(nick, game) {
  const url = serverurl + "update?nick=" + nick + "&game=" + game;

  var eventSource = new EventSource(url);

  eventSource.onmessage = function (event) {
    const data = JSON.parse(event.data);

    if (!('error' in data)) {

        if ('turn' in data) {

        }

        if ('winner' in data) {


        }

        if (!('winner' in data) && !('turn' in data)) {
            game.statusPair = "Paired";
        }
    }

  };
} /* end of update function */

async function getfetch(command, object) {
  const response = await fetch(serverurl + command, object);
  const responseText = await response.text();

  const parsed = JSON.parse(responseText);

  if ("error" in parsed) {
    console.log("this has an error");

    const serverMessages = document.getElementById("serverMessages");

    serverMessages.innerHTML = parsed.error;
  }

  return parsed;
}

function mkObject(object) {
  return { method: "POST", body: JSON.stringify(object) };
}
