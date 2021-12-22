"use strict";

function animateSeeds(element, numberOfSeedsToThrow, pit) {
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

    if (relativePosition == storePlayerPosition) {
      receivingElement = document.getElementById("storePlayer");
    }
    if (relativePosition < storePlayerPosition) {
      receivingElement = document.getElementById(
        "pitPlayer" + relativePosition
      );
    }
    if (relativePosition > storePlayerPosition) {
      receivingElement = document.getElementById(
        "pitOpponent" + (relativePosition - storePlayerPosition - 1)
      );
    }

    setTimeout(
      () => throwSeed(startingElement, receivingElement),
      400 / remainingSeeds
    );

    remainingSeeds--;
  }
}

/* Based on Prof. José Paulo Leal's CodePen */
function throwSeed(startingElement, receivingElement) {
  const body = document.querySelector("body");

  const rectStoreOpponent = document
    .getElementById("storeOpponent")
    .getBoundingClientRect();

  const rectStorePlayer = document
    .getElementById("storePlayer")
    .getBoundingClientRect();

  const canvasX = rectStoreOpponent.left;
  const canvasY = rectStoreOpponent.top;
  const canvasWidth = rectStorePlayer.right - rectStoreOpponent.left;
  const canvasHeight = rectStorePlayer.bottom - rectStoreOpponent.top;

  const canvas = document.createElement("canvas");

  const gc = canvas.getContext("2d");

  canvas.style.position = "absolute";
  canvas.style.left = canvasX + "px";
  canvas.style.top = canvasY + "px";
  canvas.style.zIndex = 555;

  canvas.setAttribute("width", canvasWidth);
  canvas.setAttribute("height", canvasHeight);

  body.appendChild(canvas);

  const rectStartingElement = startingElement.getBoundingClientRect();

  const x0 =
    (rectStartingElement.right + rectStartingElement.left) / 2 - canvasX;
  const y0 = rectStartingElement.top - canvasY;

  const rectReceivingElement = receivingElement.getBoundingClientRect();

  const x1 =
    (rectReceivingElement.right + rectReceivingElement.left) / 2 - canvasX;
  const y1 = rectReceivingElement.top - canvasY;

  function resetCanvas() {
    canvas.width = canvas.width;
  }

  function drawSeed(x, y, a) {
    gc.beginPath();

    gc.translate(x, y);
    gc.rotate(a);
    gc.scale(2, 1);
    gc.arc(0, 0, 20, 0, 2 * Math.PI);
    gc.fillStyle = "brown";
    gc.fill();
  }

  function frame(t) {
    const x = x0 + (x1 - x0) * t;
    const y = y0 + (y1 - y0) * t + ((5 * (x1 - x0)) / 2) * (0.5 - t) ** 2;
    const a = (Math.PI / 2) * (t - 0.5);

    resetCanvas();

    drawSeed(x, y, a);
  }

  function move(t_) {
    const t = t_ ? t_ : 0;

    frame(t);
    if (t <= 1) requestAnimationFrame(() => move(t + 0.01));
    else canvas.remove();
  }

  move();
}

/* Based on and following the tutorial at https://www.youtube.com/watch?v=R_CnWF3a_ks */
function fireworks() {
  const body = document.querySelector("body");

  const canvas = document.createElement("canvas");
  canvas.style.position = "absolute";
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.setAttribute("width", window.innerWidth);
  canvas.setAttribute("height", window.innerHeight);

  body.appendChild(canvas);

  const gc = canvas.getContext("2d");

  const gravity = 0.01;
  const friction = 0.99;
  const power = 5;

  class Particle {
    constructor(x, y, radius, color, velocity) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.velocity = velocity;
      this.alpha = 1;
    }

    draw() {
      gc.save();
      gc.globalAlpha = this.alpha;
      gc.beginPath();
      gc.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      gc.fillStyle = this.color;
      gc.fill();
      gc.closePath();
      gc.restore();
    }

    update() {
      this.draw();
      this.velocity.x *= friction;
      this.velocity.y *= friction;
      this.velocity.y += gravity;
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.alpha -= 0.01;
    }
  }

  const particles = [];

  const x = getRandomNumber(0, window.innerWidth);
  const y = getRandomNumber(0, window.innerHeight);

  const particleCount = 400;

  const angleIncrement = (Math.PI * 2) / particleCount;

  for (let i = 0; i < particleCount; i++) {
    particles.push(
      new Particle(x, y, 5, `hsl(${Math.random() * 360},50%,50%)`, {
        x: Math.cos(angleIncrement * i) * Math.random() * power,
        y: Math.sin(angleIncrement * i) * Math.random() * power,
      })
    );
  }

  function animateFireworks(t_) {
    const t = t_ ? t_ : 0;

    requestAnimationFrame(() => animateFireworks(t + 0.01));

    if (t <= 1) {
      gc.fillStyle = "rgba(0,0,0,0.001)";
      gc.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        if (particle.alpha > 0) particle.update();
        else particles.splice(i, 1);
      });
    } else canvas.remove();
  }

  animateFireworks();
}