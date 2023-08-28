/* ---- Imports Section */
import React, { useState, useRef } from 'react';
// Components
import { PicrossProvider } from '../playGame/picrossProvider';
// Functions
import { importGame } from '../gameImportExport/importGame';
import { checkGameBlank, checkGameRectangular } from '../boardDisplay/getBoardInfo';
/* End ---- */

/* ---- Import Game via code entered into textbox on form */
// Call PicrossProvider onSubmit
export const PlayGame = () => {
  const [submit, setSubmit] = useState(false);
  const gameCode = useRef();
  const gameSolution = useRef();

  /* <- Handle Input Changes & Form Submission -> */
  const handleSubmit = (e) => {
    let errorMsg = '';
    gameSolution.current = importGame(gameCode.current.value);

    if (checkGameBlank(gameSolution.current)) {
      errorMsg += 'Invalid Code. Code entered results in a blank puzzle.\n';
    }
    if (!checkGameRectangular(gameSolution.current)) {
      errorMsg += 'Invalid Code. Code entered results in an irregularly shaped puzzle.\n';
    }

    if (errorMsg === '') {
      setSubmit(true);
    } else {
      alert(errorMsg);
    }
  }

  return (
    <>
      {!submit ? (
        <form action='' id='enterGameCode'>
          <label htmlFor='gameCode'>Enter Code: </label>
          <input type='text' id='gameCode' name='gameCode' ref={gameCode} />
          <button type='button' id='submit' name='submit' onClick={() => handleSubmit()}>Play Puzzle</button>
        </form>
      ) : (
          <PicrossProvider gameSolution={gameSolution.current} />
      )}
    </>
  );
}