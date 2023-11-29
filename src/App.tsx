/* ---- Imports Section */
import React, { useState, useRef } from 'react';
// Components
import { PlayGame } from './nonogram/playGame/playGame.tsx';
import { CreateGameProvider } from './nonogram/createGame/createGameProvider.tsx';
// Functions
import { getGameByColumn } from './nonogram/boardDisplay/getBoardInfo.ts';
import { importGame } from './nonogram/gameImportExport/importGame.ts';
import { exportGame } from './nonogram/gameImportExport/exportGame.ts';
import logo from './logo.svg';
import './App.css';
/* End ---- */

const gameSolution5x5 = [[true, true, true, true, true],
[false, true, true, false, false],
[false, true, false, true, false],
[false, true, true, false, false],
[false, true, true, false, false]];
let colGame = getGameByColumn(gameSolution5x5);
console.log('colGame');
console.log(colGame);

let gameSolution1 = [[true, true, true, true, true],
[false, true, true, false, false],
[false, true, false, true, false],
[false, true, true, false, false],
[false, true, false, false, false]];

let gameSolution2 = [[true, false, false, false, false],
[false, false, false, false, false],
[false, false, false, false, false],
[false, false, false, false, false],
[false, false, false, false, false]];

let gameSolution3 = [[false, true, true, false, true],
[false, true, true, false, false],
[false, true, false, true, false],
[false, true, true, false, false],
[false, true, false, false, false]];

export const App = () => {
  const [playPuzzle, setPlayPuzzle] = useState(false);
  const [createPuzzle, setCreatePuzzle] = useState(false);
  const boardHeight = useRef<HTMLSelectElement>(null);
  const boardWidth = useRef<HTMLSelectElement>(null);

  exportGame(gameSolution1);
  exportGame(gameSolution2);
  exportGame(gameSolution3);
  return (
    <div className="App">
      {!playPuzzle && !createPuzzle && (
        <>
          <button type='button' className='playPuzzle button' onClick={() => setPlayPuzzle(true)}>Play</button>

          <select name="height" id="height" ref={boardHeight}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
          <select name="width" id="width" ref={boardWidth}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
          <button type='button' className='createPuzzle button' onClick={() => setCreatePuzzle(true)}>Create</button>
        </>
      )}
      {playPuzzle && (
        <PlayGame />
      )}
      {createPuzzle && boardHeight.current !== null && boardWidth.current !== null && (
        <CreateGameProvider boardHeight={parseInt(boardHeight.current.value)} boardWidth={parseInt(boardWidth.current.value)} />
      )}
    </div>
  );
}

export default App;