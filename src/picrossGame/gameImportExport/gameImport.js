/* ---- Imports Section */
import React, { useState } from 'react';
import { PicrossProvider } from '../picrossProvider';

/* ---- Import Game via code entered into textbox on form */
// Call PicrossProvider onSubmit
export const ImportGame = () => {
  const [puzzleCode, setPuzzleCode] = useState('');
  const [submit, setSubmit] = useState(false);

  /* <- Handle Input Changes & Form Submission -> */
  const handleChange = (e) => {
    setPuzzleCode(e.target.value);
  }
  const handleSubmit = (e) => {
    setPuzzleCode(decodeGameHash(puzzleCode));
    setSubmit(true);
  }

  return (
    <>
      {!submit ? (
        <form action='' id='enterPuzzleCode'>
          <label for='puzzleCode'>Enter Code: </label>
          <input type='text' id='puzzleCode' name='puzzleCode' value={puzzleCode} onChange={handleChange} />
          <button type='button' id='submit' name='submit' onClick={() => handleSubmit()}>Play Puzzle</button>
        </form>
      ) : (
        <PicrossProvider gameSolution={puzzleCode} />)
      }
    </>
  );
}

export const decodeGameHash = (gameHash) => {
  const gameSolution = JSON.parse(atob(gameHash));
  console.log(gameHash);
  console.log(gameSolution);
  return gameSolution;
}