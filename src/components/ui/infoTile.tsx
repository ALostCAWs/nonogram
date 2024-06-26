import { useContext } from 'react';
import { GAME_MODE_STATE } from 'constants/gameModeState';
import { GameModeContext } from 'contexts/gameModeContext';
import { TileState } from 'interfaces/tileState';
import { Hints } from 'components/ui/hints';
import { FillLineToggleButton } from 'components/ui/fillLineToggleButton';
import { checkLineComplete, getMaxHintCountByLineLength } from 'functions/getPuzzleInfo';

interface InfoTileProps {
  currentPuzzle: TileState[][],
  puzzleSolution: boolean[][],
  tileSize: number,
  lineType: string
}

/**
 * Displays InfoTiles along the Boards' top & left sides
 * These InfoTiles can contain different items depending on the GameModeContext
 *
 * @returns GameModeContext === GAME_MODE_STATE.PLAY - Displays Hints based on the puzzleSolution & currentPuzzle
 * @returns GameModeContext === GAME_MODE_STATE.CREATE - Displays buttons for easy filling & emptying of all Tiles in a line
 */
export const InfoTile = ({ currentPuzzle, puzzleSolution = [], tileSize, lineType }: InfoTileProps) => {
  const gameMode = useContext(GameModeContext);

  return (
    <>
      {gameMode === GAME_MODE_STATE.PLAY && (
        <>
          {puzzleSolution.map((line, i) =>
            <div key={`${lineType}Info${i}`}
              data-testid={`${lineType}Info${i}`}
              className={`${lineType}Infos ${lineType}Info${i} ${checkLineComplete(line, currentPuzzle[i]) ? 'completeLineHint' : ''}`}
              style={{
                height: tileSize,
                width: tileSize,
                justifyContent: 'flex-end'
              }}>
              <Hints puzzleSolutionLine={line}
                currentPuzzleLine={currentPuzzle[i]}
                lineIndex={i}
                maxHintCount={getMaxHintCountByLineLength(line.length)}
                lineType={lineType}
              />
            </div>
          )}
        </>
      )}

      {gameMode === GAME_MODE_STATE.CREATE && (
        <>
          {currentPuzzle.map((line, i) =>
            <div
              key={`${lineType}Info${i}`}
              data-testid={`${lineType}Info${i}`}
              className={`${lineType}Infos ${lineType}Info${i}`}
              style={{
                height: tileSize,
                width: tileSize,
                justifyContent: 'center'
              }}>
              <FillLineToggleButton
                line={line}
                lineIndex={i}
                tileSize={tileSize}
                lineType={lineType}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};