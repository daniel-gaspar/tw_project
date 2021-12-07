const serverurl = "http://twserver.alunos.dcc.fc.up.pt:8008/"

/* Sends Server a request for the ranking, converts JSON into object and visualize */
function ranking(){
    const abc = fetch(serverurl+'ranking', { method: 'POST', 
    headers: {
        'Content-Type': 'application/json' },
    body: JSON.stringify({}) })
    .then(console.log)
    .catch(console.log);

} /* end of ranking function */

/* Retrieves nick and password, sends Server a request.
Display eventual errors in message box */
function register(nick="dgaspar",pass="123456789"){
    const objectToSend = { nick: nick, password: pass };

    fetch(serverurl+'register',
    {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(objectToSend)
     })
     .then(console.log)
     .catch(console.log);
} /* end of register function */

/* Retrieves nick and password, sends Server a request.
Display eventual errors in message box */
function join(nick,pass,size,initial,group="999") {

} /* end of join function */

/* Retrieves nick, pass and game, sends Server a request.
Display eventual errors in message box */
function leave(nick,pass,game){

} /* end of leave function */

/* 
*/
function notify(nick,pass,game,move) {

} /* end of notify function */

/*
*/
function update(nick,game) {

} /* end of update function */