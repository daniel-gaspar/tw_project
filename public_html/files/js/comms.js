("use strict");

const serverurl = "http://twserver.alunos.dcc.fc.up.pt:8008/";

/* Sends Server a request for the ranking, converts JSON into object and visualize */
async function ranking() {
  const object = mkObject({});

  const getFetchResult = await getfetch("ranking", object);

  if(!("error" in getFetchResult)) { updateRankingsTable('online',getFetchResult.ranking); }

  //console.log(getFetchResult);
} /* end of ranking function */

/* Retrieves nick and password, sends Server a request.
Display eventual errors in message box */
async function register(nick = "dgaspar", password = "123456789") {
  const object = mkObject({ nick, password });

  const getFetchResult = await getfetch("register", object);

  if (!("error" in getFetchResult)) {
    replaceServerMessages("Welcome " + nick + "!");
    game.onlineStatus = "LoggedIn";
    game.nick = nick;
    game.password = password;
  }

  //console.log(getFetchResult);
} /* end of register function */

/* Retrieves nick and password, sends Server a request.
Display eventual errors in message box */
async function join(nick, password, size, initial, group = "999") {
  const object = mkObject({ nick, password, size, initial, group });

  const getFetchResult = await getfetch("join", object);

  if (!("error" in getFetchResult)) {
    game.hash = getFetchResult.game;
    game.statusPair = "Pairing";
    update(game.nick, game.hash);
  }

  //console.log(getFetchResult);
} /* end of join function */

/* Retrieves nick, pass and game, sends Server a request.
Display eventual errors in message box */
async function leave(nick, password, game) {
  const object = mkObject({ nick, password, game });

  const getFetchResult = await getfetch("leave", object);

  //console.log(getFetchResult);
} /* end of leave function */

/*
 */
async function notify(nick, password, game, move) {
  const object = mkObject({ nick, password, game, move });

  const getFetchResult = await getfetch("notify", object);

  //console.log(getFetchResult);
} /* end of notify function */

/*
 */
async function update(nick, gamehash) {

  const serverMessages = document.getElementById("serverMessages");

  const url = serverurl + "update?nick=" + nick + "&game=" + gamehash;

  const eventSource = new EventSource(url);

  eventSource.onmessage = function (event) {
    const data = JSON.parse(event.data);

    if (!("error" in data)) {
      if ("board" in data) {
        if (game.statusPair == "Pairing") {
          game.statusPair = "Paired";

          serverMessages.innerHTML = "You are now paired with another player";

          for (player in data.board.sides) {
            if (player != game.nick) game.nickOpponent = player;
          }

          game.turn = game.nick == data.board.turn ? "Player" : "Opponent";
        } else {
          game.updateFromBoard(data.board);
        }
      }

      if ("winner" in data) {
        if ("board" in data) {
          if (data.winner == game.nick) {
            replaceGameMessages("The Game Is Over. Player Wins.");
          } else if (data.winner == game.nickOpponent) {
            replaceGameMessages("The Game Is Over. Opponent Wins.");
          } else {
            replaceGameMessages("The Game Is Over. It's a Draw.");
          }
        } else {
          if(data.winner == null) {
            serverMessages.innerHTML = "You have left the pairing process.";
          }
          else { replaceGameMessages("You have forfeited. Opponent Wins."); }
        }
        game.statusPair = null;
        eventSource.close();
        serverMessages.innerHTML = "This online game is over";
      }
    } else {
      serverMessages.innerHTML = "Error: " + data.error;
    }
  };
} /* end of update function */

async function getfetch(command, object) {
  const response = await fetch(serverurl + command, object);
  const responseText = await response.text();

  const parsed = JSON.parse(responseText);

  if ("error" in parsed) {
    console.log("this has an error");

    replaceServerMessages("Error: " + parsed.error);
  }

  return parsed;
}

function mkObject(object) {
  return { method: "POST", body: JSON.stringify(object) };
}