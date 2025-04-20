import React, { useState, useEffect } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import PlayerSearch from './PlayerSearch';

interface GridProps {
  rowTeams: string[];
  colTeams: string[];
}

interface Cell {
  rowTeam: string;
  colTeam: string;
  answer: string | null;
  isCorrect: boolean | null;
  rarity: number | null;
}

const Grid: React.FC<GridProps> = ({ rowTeams, colTeams }) => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<{ player_id: string; player_display_name: string } | null>(null);

  useEffect(() => {
    // Initialize grid
    const initialGrid: Cell[][] = Array(3).fill(null).map((_, rowIndex) =>
      Array(3).fill(null).map((_, colIndex) => ({
        rowTeam: rowTeams[rowIndex],
        colTeam: colTeams[colIndex],
        answer: null,
        isCorrect: null,
        rarity: null,
      }))
    );
    setGrid(initialGrid);
  }, [rowTeams, colTeams]);

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell([row, col]);
    setSelectedPlayer(null);
  };

  const handlePlayerSelect = (player: { player_id: string; player_display_name: string }) => {
    setSelectedPlayer(player);
  };

  const handleSubmit = async () => {
    if (!selectedCell || !selectedPlayer) return;

    const [row, col] = selectedCell;
    const cell = grid[row][col];

    try {
      const response = await fetch('/api/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerId: selectedPlayer.player_id,
          rowTeam: cell.rowTeam,
          colTeam: cell.colTeam,
        }),
      });

      const data = await response.json();
      
      const newGrid = [...grid];
      newGrid[row][col] = {
        ...cell,
        answer: selectedPlayer.player_display_name,
        isCorrect: data.isCorrect,
        rarity: data.rarity,
      };
      setGrid(newGrid);
      setSelectedCell(null);
      setSelectedPlayer(null);
    } catch (error) {
      console.error('Error validating answer:', error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <div className="grid grid-cols-4 gap-4">
        {/* Empty top-left corner */}
        <div className="h-24 rounded-lg" />
        
        {/* Column headers */}
        {colTeams.map((team, index) => (
          <div 
            key={index} 
            className="h-24 bg-primary text-white p-4 rounded-lg flex items-center justify-center text-center font-medium shadow-md"
          >
            {team}
          </div>
        ))}

        {/* Grid rows */}
        {grid.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {/* Row header */}
            <div className="h-24 bg-primary text-white p-4 rounded-lg flex items-center justify-center text-center font-medium shadow-md">
              {rowTeams[rowIndex]}
            </div>
            
            {/* Grid cells */}
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => !cell.answer && handleCellClick(rowIndex, colIndex)}
                className={`h-24 p-4 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md
                  ${cell.isCorrect === true ? 'bg-green-100 border-2 border-green-500' : 
                    cell.isCorrect === false ? 'bg-red-100 border-2 border-red-500' : 
                    'bg-gray-50 border-2 border-gray-200 hover:border-blue-400'}`}
              >
                {cell.answer ? (
                  <div className="text-center">
                    <div className="font-semibold">{cell.answer}</div>
                    {cell.rarity !== null && (
                      <div className="text-sm text-gray-600 mt-1">
                        {cell.rarity}%
                      </div>
                    )}
                    {cell.isCorrect !== null && (
                      <div className="mt-2">
                        {cell.isCorrect ? (
                          <CheckIcon className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <XMarkIcon className="h-5 w-5 text-red-500 mx-auto" />
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-400">Click to answer</div>
                )}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* Input modal */}
      {selectedCell && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-xl font-semibold mb-4">Enter Player Name</h3>
            <PlayerSearch onSelect={handlePlayerSelect} />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setSelectedCell(null);
                  setSelectedPlayer(null);
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                disabled={!selectedPlayer}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Grid; 