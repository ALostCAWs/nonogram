/* ---- Imports Section */
import { FILL_STATE } from 'constants/fillState';
import { checkLineFilled } from 'functions/getPuzzleInfo';
import { setTileColFillState, setTileRowFillState } from 'functions/updatePuzzleLines';
import React from 'react';
/* End ---- */

interface FillLineToggleButtonProps {
  currentPuzzle: string[][],
  line: string[],
  lineIndex: number,
  lineType: string
}

export const FillLineToggleButton = ({ currentPuzzle, line, lineIndex, lineType }: FillLineToggleButtonProps) => {
  const fillToSet = checkLineFilled(line) ? FILL_STATE.EMPTY : FILL_STATE.FILLED;
  const toggleFill = lineType === 'row' ? setTileRowFillState.bind(this, currentPuzzle, lineIndex, fillToSet) : setTileColFillState.bind(this, currentPuzzle, lineIndex, fillToSet);
  return (
    <>
      {checkLineFilled(line) ? (
        <button type='button' className='fillLineToggle button' onClick={toggleFill}>Clear</button>
      ) : (
        <button type='button' className='fillLineToggle button' onClick={toggleFill}>Fill</button>
      )}
    </>
  );
};