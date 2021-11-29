("use strict");

/* function to generate a random number, between a minimum and a Maximum. Used to randomly distribute the seeds inside a pit */
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
} /* end of getRandomNumber function */
