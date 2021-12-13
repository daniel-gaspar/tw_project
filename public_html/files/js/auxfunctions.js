("use strict");

/* function to generate a random number, between a minimum and a Maximum. Used to randomly distribute the seeds inside a pit */
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
} /* end of getRandomNumber function */

function sortOfflineRankings() {
  offlineRankings.sort(function(a, b) {
    return b.victories - a.victories;
  });

  localStorage.setItem("ranking", JSON.stringify(offlineRankings));
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

  const tableCaption = document.createElement("div");
  tableCaption.classList.add("scoreTableCaption");
  tableCaption.innerHTML = capitalizeFirstLetter(status) + " Scores";
  
  const tableHeader = document.createElement("div");
  tableHeader.classList.add("scoreTableHeader");

  const tableHeaderNick = document.createElement("div");
  tableHeaderNick.classList.add("scoreTableHeaderCell");
  tableHeaderNick.innerHTML = "Nicks";
  tableHeader.appendChild(tableHeaderNick);
  
  const tableHeaderVictories = document.createElement("div");
  tableHeaderVictories.classList.add("scoreTableHeaderCell");
  tableHeaderVictories.innerHTML = "Victories";
  tableHeader.appendChild(tableHeaderVictories);

  const tableHeaderGames = document.createElement("div");
  tableHeaderGames.classList.add("scoreTableHeaderCell");
  tableHeaderGames.innerHTML = "Games";
  tableHeader.appendChild(tableHeaderGames);

  const tableBody = document.createElement("div");
  tableBody.classList.add("scoreTableBody");

  for (player of rankingsArray) {
    const tableRow = document.createElement("div");
    tableRow.classList.add("scoreTableRow");
    

    const tableCellNick = document.createElement("div");
    tableCellNick.classList.add("scoreTableCell");
    tableCellNick.innerHTML = player.nick;
    tableRow.appendChild(tableCellNick);

    const tableCellVictories = document.createElement("div");
    tableCellVictories.classList.add("scoreTableCell");
    tableCellVictories.innerHTML = player.victories;
    tableRow.appendChild(tableCellVictories);

    const tableCellGames = document.createElement("div");
    tableCellGames.classList.add("scoreTableCell");
    tableCellGames.innerHTML = player.games;
    tableRow.appendChild(tableCellGames);

    tableBody.appendChild(tableRow);
  }

  element.appendChild(tableCaption);
  element.appendChild(tableHeader);
  element.appendChild(tableBody);

}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}