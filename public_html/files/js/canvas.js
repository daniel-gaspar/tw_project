"use strict";

function animateSeeds(element,numberOfSeedsToThrow,pit) {
  const startingElement = element;
  const numberOfPits = game.pits.length;

  let remainingSeeds = numberOfSeedsToThrow;
  let currentPosition = pit;
  let relativePosition;

  const storeOpponentPosition = game.storeOpponentPosition;
  const storePlayerPosition = game.storePlayerPosition;

  while (remainingSeeds > 0) {
    currentPosition++;
    relativePosition = currentPosition % numberOfPits;

    if (relativePosition == storeOpponentPosition) {
      currentPosition++;
      relativePosition = currentPosition % numberOfPits;
    }
  
    let receivingElement;

    if(relativePosition == storePlayerPosition) {
      receivingElement = document.getElementById("storePlayer");
    }
    if(relativePosition < storePlayerPosition) {
      receivingElement = document.getElementById("pitPlayer" + relativePosition);
    }
    if(relativePosition > storePlayerPosition) {
      receivingElement = document.getElementById("pitOpponent" + (relativePosition - storePlayerPosition - 1 ));
    }

    setTimeout(()=>throwSeed(startingElement,receivingElement),400/remainingSeeds);

    remainingSeeds--;
  }
}


function throwSeed (startingElement,receivingElement) {
  const body = document.querySelector('body');

  const rectStoreOpponent = document.getElementById("storeOpponent").getBoundingClientRect();

  const rectStorePlayer = document.getElementById("storePlayer").getBoundingClientRect();

  const canvasX = rectStoreOpponent.left;
  const canvasY = rectStoreOpponent.top;
  const canvasWidth = rectStorePlayer.right - rectStoreOpponent.left;
  const canvasHeight = rectStorePlayer.bottom - rectStoreOpponent.top;

  const canvas = document.createElement('canvas');

  const gc = canvas.getContext('2d');

  canvas.style.position = "absolute";
  canvas.style.left = canvasX + "px";
  canvas.style.top = canvasY + "px";
  canvas.style.zIndex = 555;

  canvas.setAttribute("width",canvasWidth);
  canvas.setAttribute("height",canvasHeight);

  body.appendChild(canvas);

  const rectStartingElement = startingElement.getBoundingClientRect();

  const x0 = ((rectStartingElement.right + rectStartingElement.left)/2) - canvasX;
  const y0 = rectStartingElement.top - canvasY;

  const rectReceivingElement = receivingElement.getBoundingClientRect();

  const x1 = ((rectReceivingElement.right + rectReceivingElement.left)/2) - canvasX;
  const y1 = rectReceivingElement.top - canvasY;

  function resetCanvas(){
    canvas.width = canvas.width;
  }

  function drawSeed(x,y,a) {
    gc.beginPath();

    gc.translate(x,y);
    gc.rotate(a);
    gc.scale(2,1);
    gc.arc(0,0,20,0,2*Math.PI);
    gc.fillStyle = "brown";
    gc.fill();
  }

  function frame(t) {
    const x = x0 + (x1 - x0)*t;
    const y = y0 + (y1 - y0)*t + 5*(x1 - x0)/2*(0.5 - t)**2;
    const a = Math.PI / 2 * (t - 0.5);
  
    resetCanvas();
  
    drawSeed(x,y,a);
  }

  function move(t_) {
    const t = t_ ? t_ : 0;

    frame(t);
    if(t <= 1)
      requestAnimationFrame( () => move(t+0.01));
    else
      canvas.remove();
  }

  move();

}









/*function anime(x0,y0,x1,y1) {
    const body = document.querySelector('body')
    const tela = document.createElement('canvas');
    const gc = tela.getContext('2d');
  
    tela.setAttribute("width",500);
    tela.setAttribute("height",500);
  
    tela.style.position = "fixed";
  
    body.appendChild(tela);
  
    function reset() {
      tela.width = tela.width;
    }
  
    function seed(x,y,a) {
        gc.beginPath();
  
        gc.translate(x,y);
        gc.rotate(a);
        gc.scale(2,1);
        gc.arc(0,0,20,0,2*Math.PI);
        gc.fillStyle = "brown";
        gc.fill();
    }
  
    function frame(t) {
      const x = x0 + (x1 - x0)*t;
      const y = y0 + (y1 - y0)*t + 5*(x1 - x0)/2*(0.5 - t)**2;
      const a = Math.PI / 2 * (t - 0.5);
  
      reset();
  
      seed(x,y,a);
    }
  
    function move(t_) {
      const t = t_ ? t_ : 0;
  
      frame(t);
      if(t <= 1)
        requestAnimationFrame( () => move(t+0.01));
      else
        tela.remove();
    }
    
    move();
  }
  
  
  const [ x0, y0 ] = [ 100, 200 ];
  const [ x1, y1 ] = [ 300, 200 ];
  
  function pack(n) {
    
    for(let c=0; c < n; c++ )
      setTimeout( () => anime(x0,y0,x1,y1), c * 600);
  }
  */