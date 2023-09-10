
/* ---- Imports Section */
import { fillState } from "../state.js";
/* End ---- */

/* ---- Completion Check Functions  */
// Check if a given column / row is complete & returns bool
export const checkLineComplete = (gameSolutionLine, updatedGameLine) => {
  for (let i = 0; i < gameSolutionLine.length; i++) {
    if (gameSolutionLine[i] && updatedGameLine[i] !== fillState.filled) {
      return false;
    }
  }
  return true;
}

// Check each column & row for completion, break the search as soon as an incomplete line is found
export const checkGameComplete = (gameSolution, updatedGame) => {
  for (let i = 0; i < gameSolution.length; i++) {
    let gameComplete = checkLineComplete(getColumn(gameSolution, i), getColumn(updatedGame, i));
    if (!gameComplete) {
      return false;
    }
    gameComplete = checkLineComplete(gameSolution[i], updatedGame[i]);
    if (!gameComplete) {
      return false;
    }
  }
  return true;
}

/* ---- Validity Check Functions */
// Very basic check, only ensures at least one tile is to be filled in
// Doesn't account for ensuring a puzzle doesn't have multiple feasible solutions based on the hints that will be generated in order to solve it
export const checkGameNotBlank = (inputGame) => {
  for (let i = 0; i < inputGame[0].length; i++) {
    let col = new Set(getColumn(inputGame, i));
    if (col.has(fillState.filled) || col.has(true)) {
      return true;
    }
  }
  for (let i = 0; i < inputGame.length; i++) {
    let row = new Set(inputGame[i]);
    if (row.has(fillState.filled) || row.has(true)) {
      return true;
    }
  }
  return false;
}

export const checkGameRectangular = (inputGame) => {
  // Ensure all row lengths are equal to the length of the first row
  // Only have to check against the first row due to the import method slicing row by row based on the given width
  // Only have to check rows as unequal columns result in unequal rows & vice-versa
  let rowLengthToEnforce = inputGame[0].length;
  for (let i = 1; i < inputGame.length; i++) {
    if (rowLengthToEnforce !== inputGame[i].length) {
      return false;
    }
  }
  return true;
}

/* ---- Get Column */
export const getColumn = (inputGame, colIndex) => {
  let column = [];
  for (let i = 0; i < inputGame.length; i++) {
    column.push(inputGame[i][colIndex]);
  }
  return column;
}

export const getGameByColumn = (inputGame) => {
  let gameByColumn = [];
  for (let i = 0; i < inputGame[0].length; i++) {
    let column = getColumn(inputGame, i);
    gameByColumn.push(column);
  }
  return gameByColumn;
}

/* ---- Longest Dimension */
export const getLongestDimension = (inputGame) => {
  return inputGame.length >= inputGame[0].length ? inputGame.length : inputGame[0].length;
}

/* ---- Max Number of Hints */
// Based on the length of the line
export const getMaxHintCountByLineLength = (lineLength) => {
  return Math.ceil(lineLength / 2);
}