import { Cell } from './Cell';
import type { Grid as GridType, ColoredCells } from '../hooks/useGameOfLife';

interface GridProps {
  grid: GridType;
  onCellClick: (row: number, col: number) => void;
  coloredCells: ColoredCells;
}

export const Grid = ({ grid, onCellClick, coloredCells }: GridProps) => {
  return (
    <div className="inline-block border-2 border-border rounded-lg overflow-hidden shadow-sm">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              isAlive={cell}
              onClick={() => onCellClick(rowIndex, colIndex)}
              color={coloredCells[`${rowIndex},${colIndex}`]}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
