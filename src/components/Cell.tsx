interface CellProps {
  isAlive: boolean;
  onClick: () => void;
  color?: string; // couleur pastel si structure detectee
}

export const Cell = ({ isAlive, onClick, color }: CellProps) => {
  // si ya une couleur de structure, on lutilise sinon mint par defaut
  const bgStyle = color ? { backgroundColor: color } : undefined;

  return (
    <div
      onClick={onClick}
      style={bgStyle}
      className={`w-4 h-4 border border-border cursor-pointer transition-colors duration-75
        ${isAlive ? (color ? '' : 'bg-mint') : 'bg-soft-gray hover:bg-soft-gray-hover'}`}
    />
  );
};
