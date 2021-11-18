window.addEventListener("load", function () {
    document
      .getElementById("authAreaButton")
      .addEventListener("click", toggleElementDisplayOpen);
    document
      .getElementById("selectionBarItemGameRules")
      .addEventListener("click", toggleElementDisplayOpen);
    document
      .getElementById("selectionBarItemGameScores")
      .addEventListener("click", toggleElementDisplayOpen);
    document
      .getElementById("selectionBarItemGameSettings")
      .addEventListener("click", toggleElementDisplayOpen);
    document
      .getElementById("tabGameRulesTableToggle")
      .addEventListener("click", toggleElementDisplayOpen);
    document
      .getElementById("tabGameRulesPiecesToggle")
      .addEventListener("click", toggleElementDisplayOpen);
    document
      .getElementById("tabGameRulesStartToggle")
      .addEventListener("click", toggleElementDisplayOpen);
    document
      .getElementById("tabGameRulesPlayToggle")
      .addEventListener("click", toggleElementDisplayOpen);
    document
      .getElementById("tabGameRulesSeedToggle")
      .addEventListener("click", toggleElementDisplayOpen);
    document
      .getElementById("tabGameRulesContinueSeedingToggle")
      .addEventListener("click", toggleElementDisplayOpen);
    document
      .getElementById("tabGameRulesLastContainerToggle")
      .addEventListener("click", toggleElementDisplayOpen);
    document
      .getElementById("tabGameRulesLastEmptyToggle")
      .addEventListener("click", toggleElementDisplayOpen);
    document
      .getElementById("tabGameRulesEndToggle")
      .addEventListener("click", toggleElementDisplayOpen);
    document
      .getElementById("settingsStartGameButton")
      .addEventListener("click", startGame);
  });
  
  const game = new Mancala();
  let gamesWonByPlayer = 0;
  let gamesWonByPC = 0;