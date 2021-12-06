/* Sends Server a request for the ranking, converts JSON into object and visualize */
function ranking(){

} /* end of ranking function */

/* Retrieves nick and password, sends Server a request.
Display eventual errors in message box */
function register(nick,pass){
    const objectToSend = { nick: nick, password: pass }
    const JSONObject = JSON.stringify(objectToSend);

    

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