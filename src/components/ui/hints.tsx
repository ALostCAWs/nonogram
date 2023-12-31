import { FILL_STATE } from 'constants/fillState';
import { HINT_STATE } from 'constants/hintState';
import { TileState } from 'interfaces/tileState';
import { convertTileStateLineToStringLine } from 'functions/convertPuzzle';

interface HintsProps {
  puzzleSolutionLine: boolean[],
  currentPuzzleLine: TileState[],
  lineIndex: number,
  maxHintCount: number,
  lineType: string
}

interface Hint {
  value: number,
  state: string
}

/**
 * Hint Text Display
 * Calculates the hints based on the current puzzleSolutionLine
 * Check if . . .
 * Individual hint = puzzleHeight (col) puzzleWidth (row) & set to fullHint
 * Hint array for a given col / row empty & set to zeroHint
 * All hints for a given line are complete, add completed class to parent div
 *
 * Determines whether or not any of the hints in the currentPuzzleLine have been solved
 * Displays the calculated hints & applies styles to any that have been solved
 *
 * @returns Div containing the hints within the current InfoTile
 */
export const Hints = ({ puzzleSolutionLine, currentPuzzleLine, lineIndex, maxHintCount, lineType }: HintsProps) => {
  const hints: Hint[] = [];
  let hintCount = 0;
  let currentTilesInHintFillState: TileState[] = [];

  for (let i = 0; i < puzzleSolutionLine.length; i++) {
    const solution = puzzleSolutionLine[i];

    // Count col-adjacent trues, add current amount when false or when row end
    if (solution) {
      hintCount++;
      currentTilesInHintFillState.push(currentPuzzleLine[i]);
    }

    // If at end of column/row or an unfillable tile is found & there is a hint counted, populate hint object
    if ((i === puzzleSolutionLine.length - 1 || !solution) && hintCount !== 0) {
      // Default hintState setup for fullLineIncomplete & incomplete
      let state = hintCount === puzzleSolutionLine.length ? HINT_STATE.FULL_LINE_INCOMPLETE : HINT_STATE.INCOMPLETE;

      // Check if currentTilesInHintFillState ( now a Set => currentTilesInHintFillStateReduced ) contains one FILL_STATE.FILLED item
      const currentTilesInHintFillStateReduced = new Set(convertTileStateLineToStringLine(currentTilesInHintFillState));
      if (currentTilesInHintFillStateReduced.size === 1 && currentTilesInHintFillStateReduced.has(FILL_STATE.FILLED)) {
        state = HINT_STATE.COMPLETE;
      }

      // Push hint & reset to continue checking for potential hints
      const hint = {
        value: hintCount,
        state: state
      }
      hints.push(hint);
      hintCount = 0;
      currentTilesInHintFillState = [];
    }
  }
  // If hints for a line is empty, that entire line is empty
  if (hints.length === 0) {
    // Set hint zero value & state
    const hint = {
      value: 0,
      state: HINT_STATE.ZERO
    }
    hints.push(hint);
  }

  return (
    <>
      {lineType === 'col' && (
        <>
          {hints.map((hint, i) => <div data-testid={`hint${lineIndex} - ${i}`} key={`hint${lineIndex} - ${i}`} className={`${hint.state}`} style={{ height: `${100 / maxHintCount}%` }}>{hint.value}</div>)}
        </>
      )}
      {lineType === 'row' && (
        <>
          {hints.map((hint, i) => <div data-testid={`hint${lineIndex} - ${i}`} key={`hint${lineIndex} - ${i}`} className={`${hint.state}`} style={{ width: `${100 / maxHintCount}%` }}>{hint.value}</div>)}
        </>
      )}
    </>
  );
}