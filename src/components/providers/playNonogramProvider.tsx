import React, { useState, useEffect, useReducer, useContext } from 'react';
import { PUZZLE_ACTIONS } from 'constants/puzzleActions';
import { SelectModeContext } from 'contexts/selectModeContext';
import { FillModeContext } from 'contexts/fillModeContext';
import { PuzzleAction } from 'interfaces/puzzleAction';
import { TileState } from 'interfaces/tileState';
import { FirstLastSelectedState } from 'interfaces/firstLastSelectedState';
import { Board } from 'components/ui/board';
import { GameComplete } from 'pages/gameComplete';
import { GameOver } from 'pages/gameOver';
import { createLives, createCurrentPuzzle, checkAndSetZeroLines } from 'functions/puzzleSetup';
import { checkPuzzleComplete, checkGameOver } from 'functions/getPuzzleInfo';
import { setFirstSelectedTile, setLastSelectedTile, drawSelectedTileLine, deselectTile, hoverTile, resetInfoTiles, markSelectedTile, fillSelectedTile_PlayMode } from 'functions/tileFunctions';
import { TileFunctionsContext } from 'contexts/tileFunctionsContext';
import { InfoTileFunctionsContext } from 'contexts/infoTileFunctionsContext';

interface PlayNonogramProviderProps {
  puzzleSolution: boolean[][]
}

/**
 * Allows the user to play an imported nonogram puzzle
 *
 * Knows the puzzleSolution
 * Secondary currentPuzzle, same size as puzzleSolution, manages the users' progress
 *
 * Sets the FillModeContext, which is used to dictate which function the Tile components use as their onClick callback functions
 *
 * Tiles use callbacks to functions within when onClick
 * When Tile filled, PlayNonogramProvider checks for column / row completion
 *
 * @returns GameOver
 * @returns GameComplete
 * @returns The Board containing the InfoTiles ( hints ), Tiles for user interaction, & Lives
 * @returns Loads the Board with empty functions passed to the Tiles when the game has ended to prevent further user interaction
 */
export const PlayNonogramProvider = ({ puzzleSolution }: PlayNonogramProviderProps) => {
  const { selectMode, setSelectMode } = useContext(SelectModeContext);
  const [fillMode, setFillMode] = useState<boolean>(true);
  const [lives, setLives] = useState<number>(createLives(puzzleSolution));
  const [gameOver, setGameOver] = useState<boolean>(checkGameOver(lives));
  const [gameComplete, setGameComplete] = useState<boolean>(false);
  const [firstSelected, setFirstSelected] = useState<FirstLastSelectedState>({ rowIndex: null, colIndex: null });
  const [lastSelected, setLastSelected] = useState<FirstLastSelectedState>({ rowIndex: null, colIndex: null });

  const [currentPuzzle, currentPuzzleDispatch] = useReducer(currentPuzzleReducer, createCurrentPuzzle(puzzleSolution));

  function currentPuzzleReducer(puzzleState: TileState[][], action: PuzzleAction): TileState[][] {
    const rowIndex = action.rowIndex;
    const colIndex = action.colIndex;

    switch (action.type) {
      case PUZZLE_ACTIONS.RESET: {
        const resetPuzzle = checkAndSetZeroLines(createCurrentPuzzle(puzzleSolution), puzzleSolution);
        setLives(createLives(puzzleSolution));
        setGameComplete(checkPuzzleComplete(puzzleSolution, resetPuzzle));
        resetInfoTiles(puzzleSolution);
        return resetPuzzle;
      }

      case PUZZLE_ACTIONS.SET_ZERO_LINES:
        return puzzleState = checkAndSetZeroLines(puzzleState, puzzleSolution);

      case PUZZLE_ACTIONS.SET_FIRST_SELECT:
        return setFirstSelectedTile(setFirstSelected, puzzleState, rowIndex, colIndex);

      case PUZZLE_ACTIONS.SET_LAST_SELECT:
        return setLastSelectedTile(setLastSelected, puzzleState, firstSelected, rowIndex, colIndex);

      case PUZZLE_ACTIONS.DRAW_SELECT_LINE:
        return drawSelectedTileLine(puzzleState, firstSelected, lastSelected);

      case PUZZLE_ACTIONS.MARK: {
        if (!puzzleState[rowIndex][colIndex].selected) {
          return puzzleState;
        }

        let updatedPuzzle = markSelectedTile(puzzleState, firstSelected, lastSelected);
        updatedPuzzle = deselectTile(updatedPuzzle, setFirstSelected, setLastSelected);
        return updatedPuzzle;
      }

      case PUZZLE_ACTIONS.FILL: {
        if (!puzzleState[rowIndex][colIndex].selected) {
          return puzzleState;
        }

        const updatedPuzzleData = fillSelectedTile_PlayMode(puzzleSolution, puzzleState, firstSelected, lastSelected);
        let updatedPuzzle = updatedPuzzleData.puzzle;

        if (updatedPuzzleData.tileErrored) {
          setLives(currentLives => currentLives - 1);
        }
        if (updatedPuzzleData.tileFilled) {
          setGameComplete(checkPuzzleComplete(puzzleSolution, updatedPuzzle));
        }

        updatedPuzzle = deselectTile(updatedPuzzle, setFirstSelected, setLastSelected);
        return updatedPuzzle;
      }

      case PUZZLE_ACTIONS.DESELECT:
        return deselectTile(puzzleState, setFirstSelected, setLastSelected);

      default:
        return puzzleState;
    }
  }

  useEffect(() => {
    setFillMode(true);
  }, []);

  useEffect(() => {
    if (!selectMode) {
      currentPuzzleDispatch({ type: PUZZLE_ACTIONS.DESELECT, rowIndex: 0, colIndex: 0 });
    }
  }, [selectMode]);

  useEffect(() => {
    if (lastSelected.rowIndex !== null && lastSelected.colIndex !== null) {
      currentPuzzleDispatch({ type: PUZZLE_ACTIONS.DRAW_SELECT_LINE, rowIndex: lastSelected.rowIndex, colIndex: lastSelected.colIndex });
    }
  }, [lastSelected]);

  useEffect(() => {
    setGameOver(checkGameOver(lives));
  }, [lives]);

  useEffect(() => {
    currentPuzzleDispatch({ type: PUZZLE_ACTIONS.SET_ZERO_LINES, rowIndex: 0, colIndex: 0 });
  }, [gameComplete]);

  useEffect(() => {
    currentPuzzleDispatch({ type: PUZZLE_ACTIONS.RESET, rowIndex: 0, colIndex: 0 });
  }, [puzzleSolution]);

  const toggleFillMode = (): void => {
    if (gameComplete || gameOver) {
      return;
    }
    setFillMode(currentMode => !currentMode);
  }

  const infoTileFunctions = {
    setRowFill: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { },
    setColFill: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { }
  }

  const tileFunctions = {
    setFirstSelectTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => {
      currentPuzzleDispatch({ type: PUZZLE_ACTIONS.SET_FIRST_SELECT, rowIndex: rowIndex, colIndex: colIndex })
    },
    setLastSelectTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => {
      currentPuzzleDispatch({ type: PUZZLE_ACTIONS.SET_LAST_SELECT, rowIndex: rowIndex, colIndex: colIndex })
    },
    fillTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => {
      currentPuzzleDispatch({ type: PUZZLE_ACTIONS.FILL, rowIndex: rowIndex, colIndex: colIndex })
    },
    markTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => {
      currentPuzzleDispatch({ type: PUZZLE_ACTIONS.MARK, rowIndex: rowIndex, colIndex: colIndex })
    },
    hoverTile: hoverTile
  }

  const tileFunctions_Empty = {
    setFirstSelectTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { },
    setLastSelectTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { },
    fillTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { },
    markTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { },
    hoverTile: (e: React.MouseEvent, rowIndex: number, colIndex: number) => { }
  }

  return (
    <>
      {gameOver && (
        <GameOver resetPuzzle={() => { currentPuzzleDispatch({ type: PUZZLE_ACTIONS.RESET, rowIndex: 0, colIndex: 0 }) }} />
      )}

      {gameComplete && (
        <GameComplete lives={lives}
          resetPuzzle={
            () => { currentPuzzleDispatch({ type: PUZZLE_ACTIONS.RESET, rowIndex: 0, colIndex: 0 }); }
          }
        />
      )}

      {!gameComplete && !gameOver ? (
        <FillModeContext.Provider value={fillMode}>
          <InfoTileFunctionsContext.Provider value={infoTileFunctions}>
            <TileFunctionsContext.Provider value={tileFunctions}>
              <Board currentPuzzle={currentPuzzle}
                puzzleSolution={puzzleSolution}
                livesCount={lives}
              />
            </TileFunctionsContext.Provider>
          </InfoTileFunctionsContext.Provider>
        </FillModeContext.Provider>
      ) : (
          <FillModeContext.Provider value={fillMode}>
            <InfoTileFunctionsContext.Provider value={infoTileFunctions}>
              <TileFunctionsContext.Provider value={tileFunctions_Empty}>
                <Board currentPuzzle={currentPuzzle}
                  puzzleSolution={puzzleSolution}
                  livesCount={lives}
                />
              </TileFunctionsContext.Provider>
            </InfoTileFunctionsContext.Provider>
          </FillModeContext.Provider>
      )}

      <button type='button' className='fillModeButton toggleFillMode button' onClick={() => toggleFillMode()} disabled={fillMode}>Fill</button>
      <button type='button' className='markModeButton toggleFillMode button' onClick={() => toggleFillMode()} disabled={!fillMode}>Mark</button>
    </>
  );
}