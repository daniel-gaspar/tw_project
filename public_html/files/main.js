("use strict");

/* adds Event Listeners to each "reactable" element, upon loading the page */
window.addEventListener("load", function () {
  const authAreaButton = document.getElementById("authAreaButton");
  authAreaButton.addEventListener(
    "click",
    toggleElementDisplayOpen.bind(authAreaButton)
  );

  const selectionBarItemGameRules = document.getElementById(
    "selectionBarItemGameRules"
  );
  selectionBarItemGameRules.addEventListener(
    "click",
    toggleElementDisplayOpen.bind(selectionBarItemGameRules)
  );

  const selectionBarItemGameScores = document.getElementById(
    "selectionBarItemGameScores"
  );
  selectionBarItemGameScores.addEventListener(
    "click",
    toggleElementDisplayOpen.bind(selectionBarItemGameScores)
  );

  const selectionBarItemGameSettings = document.getElementById(
    "selectionBarItemGameSettings"
  );
  selectionBarItemGameSettings.addEventListener(
    "click",
    toggleElementDisplayOpen.bind(selectionBarItemGameSettings)
  );

  const tabGameRulesTableToggle = document.getElementById(
    "tabGameRulesTableToggle"
  );
  tabGameRulesTableToggle.addEventListener(
    "click",
    toggleElementDisplayOpen.bind(tabGameRulesTableToggle)
  );

  const tabGameRulesPiecesToggle = document.getElementById(
    "tabGameRulesPiecesToggle"
  );
  tabGameRulesPiecesToggle.addEventListener(
    "click",
    toggleElementDisplayOpen.bind(tabGameRulesPiecesToggle)
  );

  const tabGameRulesStartToggle = document.getElementById(
    "tabGameRulesStartToggle"
  );
  tabGameRulesStartToggle.addEventListener(
    "click",
    toggleElementDisplayOpen.bind(tabGameRulesStartToggle)
  );

  const tabGameRulesPlayToggle = document.getElementById(
    "tabGameRulesPlayToggle"
  );
  tabGameRulesPlayToggle.addEventListener(
    "click",
    toggleElementDisplayOpen.bind(tabGameRulesPlayToggle)
  );

  const tabGameRulesSeedToggle = document.getElementById(
    "tabGameRulesSeedToggle"
  );
  tabGameRulesSeedToggle.addEventListener(
    "click",
    toggleElementDisplayOpen.bind(tabGameRulesSeedToggle)
  );

  const tabGameRulesContinueSeedingToggle = document.getElementById(
    "tabGameRulesContinueSeedingToggle"
  );
  tabGameRulesContinueSeedingToggle.addEventListener(
    "click",
    toggleElementDisplayOpen.bind(tabGameRulesContinueSeedingToggle)
  );

  const tabGameRulesLastContainerToggle = document.getElementById(
    "tabGameRulesLastContainerToggle"
  );
  tabGameRulesLastContainerToggle.addEventListener(
    "click",
    toggleElementDisplayOpen.bind(tabGameRulesLastContainerToggle)
  );

  const tabGameRulesLastEmptyToggle = document.getElementById(
    "tabGameRulesLastEmptyToggle"
  );
  tabGameRulesLastEmptyToggle.addEventListener(
    "click",
    toggleElementDisplayOpen.bind(tabGameRulesLastEmptyToggle)
  );

  const tabGameRulesEndToggle = document.getElementById(
    "tabGameRulesEndToggle"
  );
  tabGameRulesEndToggle.addEventListener(
    "click",
    toggleElementDisplayOpen.bind(tabGameRulesEndToggle)
  );

  const settingsStartGameButton = document.getElementById(
    "settingsStartGameButton"
  );
  settingsStartGameButton.addEventListener("click", startGame);
  settingsStartGameButton.addEventListener(
    "click",
    toggleElementDisplayOpen.bind(settingsStartGameButton)
  );

  const authAreaLoginButton = document.getElementById("authAreaLoginButton");
  authAreaLoginButton.addEventListener("click", login);

  const updateOnlineRankings = document.getElementById("updateOnlineRankings");
  updateOnlineRankings.addEventListener("click", ranking);

  ranking();

  const temp = localStorage.getItem("ranking");
  if (temp != null) {
    const data = JSON.parse(temp);
    offlineRankings.length = data.length;
    for (let i = 0; i < data.length; i++) {
      offlineRankings[i] = data[i];
    }
  }
}); /* end of window loading */

window.addEventListener("unload", function () {
  localStorage.setItem("ranking", JSON.stringify(offlineRankings));
});

const game = new Mancala();

const offlineRankings = [{ nick: "computer", victories: 0, games: 0 }];

//let gamesWonByPlayer = 0;
//let gamesWonByPC = 0;
