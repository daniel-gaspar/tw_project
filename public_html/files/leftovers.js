
/*function openTab(tabName) { 
  const x = document.getElementById(tabName);
  x.classList.toggle('open');
}

function toggleRuleDisplay(ruleName) {
  const x = document.getElementById(ruleName);
  x.classList.toggle('displayed');
}

function animateAuthAreaButton() {
  const x = document.getElementById("authAreaButton");
  const y = document.getElementById("authArea");
  x.classList.toggle('open');
  y.classList.toggle('open');
}*/

/*function openTab(tabName) {
  var i;
  const x = document.getElementsByClassName("tab");
  const y = document.getElementById(tabName);
  for (i = 0; i < x.length; i++) {
    if(x[i].id != tabName) { x[i].style.display = "none"; }
  }
  if (y.style.display == "none") { y.style.display = "block"; }
  else { y.style.display = "none"; }
}*/

/*function openTab(tabName)
{
    const select = document.getElementById(tabName);
    if(select.classList.contains('active'))
    {
        select.className = select.className.replace( /(?:^|\s)active(?!\S)/g , '' );       
    }
       else
    {
        select.className = "active";       
    }
}*/

/*game.pits[pit] = 0;

        console.log(seedsInPit);
        let lastPlayed = {
          event: "",
          eventPosition: 0,
          eventRelativePosition: 0,
          lastPosition: 0,
        };
        const middle = game.pits.length / 2;
        for (let i = 1; i <= seedsInPit; i++) {
          const currentPosition = pit + i;
          const relativePosition = currentPosition % (game.pits.length + 1);
          console.log(relativePosition);
          if (relativePosition == middle) {
            game.storePlayer++;
            lastPlayed.event = "storePlayer";
            lastPlayed.eventPosition = currentPosition;
            lastPlayed.eventRelativePosition = relativePosition;
          } else {
            if (relativePosition > middle) {
              game.pits[relativePosition - 1]++;
            } else {
              if (game.pits[relativePosition] == 0) {
                lastPlayed.event = "emptyPitPlayer";
                lastPlayed.eventPosition = currentPosition;
                lastPlayed.eventRelativePosition = relativePosition;
              }
              game.pits[relativePosition]++;
            }
          }
          lastPlayed.lastPosition = currentPosition;
        }

        if (
          lastPlayed.eventPosition == lastPlayed.lastPosition &&
          lastPlayed.event == "storePlayer"
        ) {
          replaceGameMessages("The Player may play again");
          updateDisplay();
        } else {
          if (
            lastPlayed.event == "emptyPitPlayer" &&
            lastPlayed.eventPosition == lastPlayed.lastPosition
          ) {
            game.storePlayer++;
            game.storePlayer +=
              game.pits[middle + middle - lastPlayed.eventRelativePosition - 1];
            game.pits[
              middle + middle - lastPlayed.eventRelativePosition - 1
            ] = 0;
            game.pits[lastPlayed.eventRelativePosition] = 0;
          }
          game.turn = "Opponent";
          replaceGameMessages(
            "It is now the " + game.turn + "'s turn to play."
          );
          updateDisplay();
          game.opponentTurn();
        }*/