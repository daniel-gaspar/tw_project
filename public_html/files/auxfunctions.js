("use strict");

/* function to generate a random number, between a minimum and a Maximum. Used to randomly distribute the seeds inside a pit */
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
} /* end of getRandomNumber function */

function sortOfflineRankings() {
  offlineRankings.sort(function(a, b) {
    return b.victories - a.victories;
  });
}

function updateRankingsTable(status, rankingsArray) {
  let element;

  if (status == "offline") {
    element = document.getElementById("offlineScores");
  }
  if (status == "online") {
    element = document.getElementById("onlineScores");
  }

  while(element.firstChild) {
    element.removeChild(element.lastChild)
  }

  //TODO: CREATE TABLE

}