import { fillState } from "../nonogram/state.ts";
import { checkSolutionNotBlank, checkBoardNotBlank, checkGameRectangular, checkLineComplete, checkGameComplete, checkGameOver, checkTileFillable, checkTileMarkable, getColumn, getGameByColumn, getLongestDimension, getMaxHintCountByLineLength } from "../nonogram/boardDisplay/getBoardInfo.ts";

const filled = fillState.filled;
const marked = fillState.marked;
const empty = fillState.empty;
const error = fillState.error;
const complete = 'complete';

const gameSolution5x5 = [[true, true, true, true, true],
[false, true, true, false, false],
[false, true, false, true, false],
[false, true, true, false, false],
[false, true, true, false, false]];

// Game validation
it('ensures the given gameSolution is not blank', () => {
  let blankGameSolution = [[false, false, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false]];
  const resultBlankSolution = checkSolutionNotBlank(blankGameSolution);
  expect(resultBlankSolution).toEqual(false);

  let blank5x5Game = [[empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty]];
  const resultBlankGame = checkBoardNotBlank(blank5x5Game);
  expect(resultBlankGame).toEqual(false);

  let notBlank5x5Game = [[filled, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty]];
  const resultNotBlankGame = checkBoardNotBlank(notBlank5x5Game);
  expect(resultNotBlankGame).toEqual(true);

  const resultNotBlankSolution = checkSolutionNotBlank(gameSolution5x5);
  expect(resultNotBlankSolution).toEqual(true);
});

it('ensures the given gameSolution is rectangular', () => {
  const resultRectangle = checkGameRectangular(gameSolution5x5);
  expect(resultRectangle).toEqual(true);

  const irregularRow0GameSolution = [[true, true, true, true],
  [false, true, true, false, false],
  [false, true, false, true, false],
  [false, true, true, false, false],
  [false, true, true, false, false]];
  const resultNotRectangleFirstRow = checkGameRectangular(irregularRow0GameSolution);
  expect(resultNotRectangleFirstRow).toEqual(false);

  const irregularRow4GameSolution = [[true, true, true, true, true],
  [false, true, true, false, false],
  [false, true, false, true, false],
  [false, true, true, false, false],
  [false, true, true, false]];
  const resultNotRectangleLastRow = checkGameRectangular(irregularRow4GameSolution);
  expect(resultNotRectangleLastRow).toEqual(false);
});

// Completion check
it('checks if a given column / row is complete by comparing currentGame to gameSolution', () => {
  const mixedLine = [filled, empty, empty, empty, empty];
  const mixedLineSolution = [true, false, false, false, false];
  const mixedLineComplete = checkLineComplete(mixedLineSolution, mixedLine);
  expect(mixedLineComplete).toEqual(true);

  const fullLine = [filled, filled, filled, filled, filled];
  const fullLineSolution = [true, true, true, true, true];
  const fullLineComplete = checkLineComplete(fullLineSolution, fullLine);
  expect(fullLineComplete).toEqual(true);

  const emptyLine = [empty, empty, empty, empty, empty];
  const emptyLineSolution = [false, false, false, false, false];
  const emptyLineComplete = checkLineComplete(emptyLineSolution, emptyLine);
  expect(emptyLineComplete).toEqual(true);

  const errorLine = [error, error, error, error, error];
  const errorLineSolution = [false, false, false, false, false];
  const errorLineComplete = checkLineComplete(errorLineSolution, errorLine);
  expect(errorLineComplete).toEqual(true);

  const incompleteLine = [empty, empty, empty, empty, empty];
  const incompleteLineSolution = [true, false, false, false, false];
  const incompleteLineComplete = checkLineComplete(incompleteLineSolution, incompleteLine);
  expect(incompleteLineComplete).toEqual(false);

  const markedLine = [marked, empty, empty, empty, empty];
  const markedLineSolution = [true, false, false, false, false];
  const markedLineComplete = checkLineComplete(markedLineSolution, markedLine);
  expect(markedLineComplete).toEqual(false);
});

it('checks if a given currentGame is complete by comparing it to the gameSolution', () => {
  const game5x5Complete = [[filled, filled, filled, filled, filled],
  [empty, filled, filled, empty, empty],
  [empty, filled, empty, filled, empty],
  [empty, filled, filled, empty, empty],
  [empty, filled, filled, empty, empty]];
  const game5x5CompleteResult = checkGameComplete(gameSolution5x5, game5x5Complete);
  expect(game5x5CompleteResult).toEqual(true);

  const game5x5CompleteWithError = [[filled, filled, filled, filled, filled],
  [error, filled, filled, empty, empty],
  [empty, filled, empty, filled, empty],
  [empty, filled, filled, empty, empty],
  [empty, filled, filled, empty, empty]];
  const game5x5CompleteWithErrorResult = checkGameComplete(gameSolution5x5, game5x5CompleteWithError);
  expect(game5x5CompleteWithErrorResult).toEqual(true);

  const incompleteGame5x5Row0Complete = [[filled, filled, filled, filled, filled],
  [empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty]];
  const incompleteGame5x5Row0CompleteResult = checkGameComplete(gameSolution5x5, incompleteGame5x5Row0Complete);
  expect(incompleteGame5x5Row0CompleteResult).toEqual(false);

  const incompleteGame5x5Column0Complete = [[filled, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty]];
  const incompleteGame5x5Column0CompleteResult = checkGameComplete(gameSolution5x5, incompleteGame5x5Column0Complete);
  expect(incompleteGame5x5Column0CompleteResult).toEqual(false);

  const incompleteGame5x5Marked = [[marked, marked, marked, marked, marked],
  [empty, marked, marked, empty, empty],
  [empty, marked, empty, marked, empty],
  [empty, marked, marked, empty, empty],
  [empty, marked, marked, empty, empty]];
  const incompleteGame5x5MarkedResult = checkGameComplete(gameSolution5x5, incompleteGame5x5Marked);
  expect(incompleteGame5x5MarkedResult).toEqual(false);
});

it('checks if the game is lost', () => {
  expect(checkGameOver(0)).toEqual(true);
  expect(checkGameOver(1)).toEqual(false);
});

// Tile checks
it('checks if a given tile is fillable', () => {
  expect(checkTileFillable(empty)).toEqual(true);

  expect(checkTileFillable(filled)).toEqual(false);
  expect(checkTileFillable(error)).toEqual(false);
  expect(checkTileFillable(marked)).toEqual(false);
  expect(checkTileFillable(complete)).toEqual(false);
});

it('checks if a given tile is markable', () => {
  expect(checkTileMarkable(empty)).toEqual(true);
  expect(checkTileMarkable(marked)).toEqual(true);

  expect(checkTileMarkable(filled)).toEqual(false);
  expect(checkTileMarkable(error)).toEqual(false);
  expect(checkTileMarkable(complete)).toEqual(false);
});

// Array quality of life
it('gets a column from the given gameSolution array using the given index', () => {
  const i = 2;
  const expectedColumn = [true, true, false, true, true];
  const result = getColumn(gameSolution5x5, i);
  expect(result).toEqual(expectedColumn);
});

it('returns a given game flipped, allowing game[n] to be used in order to obtain a column rather than a row', () => {
  const expectedGameSolution5x5ByColumn = [[true, false, false, false, false],
  [true, true, true, true, true],
  [true, true, false, true, true],
  [true, false, true, false, false],
  [true, false, false, false, false]];
  const gameSolution5x5ByColumn = getGameByColumn(gameSolution5x5);
  expect(gameSolution5x5ByColumn).toEqual(expectedGameSolution5x5ByColumn);
});

it(`returns the length of the boards' longest dimension`, () => {
  const gameSolution10x5 = [[true, true, true, true, true, true, true, true, true, true],
  [false, true, true, false, false, false, true, true, false, false],
  [false, true, false, true, false, false, true, false, true, false],
  [false, true, true, false, false, false, true, true, false, false],
  [false, true, false, false, false, false, true, false, false, false]];

  const expectedLength = 10;
  const result = getLongestDimension(gameSolution10x5);
  expect(result).toEqual(expectedLength);
});

it(`returns the max hint count based on the given line length`, () => {
  const expectedMaxHintCount = 3;
  const result = getMaxHintCountByLineLength(5);
  expect(result).toEqual(expectedMaxHintCount);
});