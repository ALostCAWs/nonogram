/* ---- Imports Section */
import { fillState } from '../state.js';
import { getColumn, getLongestDimension } from '../boardDisplay/getBoardInfo.js';
/* End ---- */

/* ---- Initial Game Setup Functions */
/* ---- Create lives  */
export const createLives = (gameSolution) => {
  // Set starting  based on the longest dimension of the board
  let longestDimension = getLongestDimension(gameSolution);
  let lives = Math.ceil(longestDimension / 2);
  return lives;
}

/* ---- Create / Copy currentGame  */
export const createCurrentGame = (gameSolution) => {
  let currentGame = [];
  for (let i = 0; i < gameSolution.length; i++) {
    currentGame[i] = [];
    for (let j = 0; j < gameSolution[i].length; j++) {
      currentGame[i][j] = fillState.empty;
    }
  }
  return currentGame;
}

// A simple assignment failed to trigger a re-render due to the arrays referencing the same point in memory
export const copyCurrentGame = (currentGame) => {
  let gameCopy = [];
  for (let i = 0; i < currentGame.length; i++) {
    gameCopy[i] = [];
    for (let j = 0; j < currentGame[i].length; j++) {
      gameCopy[i][j] = currentGame[i][j];
    }
  }
  return gameCopy;
}

/* ---- Check / Set zero lines */
export const checkZeroLines = (updatedGame, gameSolution) => {
  // Find zero hint lines ( rows and/or columns ) & pass to functions to set fillState.error
  for (let i = 0; i < gameSolution[0].length; i++) {
    let col = new Set(getColumn(gameSolution, i));
    if (col.size === 1 && col.has(false)) {
      setTileColZero(i, updatedGame);
    }
  }
  for (let i = 0; i < gameSolution.length; i++) {
    let row = new Set(gameSolution[i]);
    if (row.size === 1 && row.has(false)) {
      setTileRowZero(i, updatedGame);
    }
  }
  return updatedGame;
}

/* ---- Functions to set all tiles in zero hint lines ( rows and/or columns ) to fillState.error */
const setTileColZero = (colIndex, currentGame) => {
  for (let i = 0; i < currentGame.length; i++) {
    currentGame[i][colIndex] = fillState.error;
  }
}
const setTileRowZero = (rowIndex, currentGame) => {
  for (let i = 0; i < currentGame[0].length; i++) {
    currentGame[rowIndex][i] = fillState.error;
  }
}