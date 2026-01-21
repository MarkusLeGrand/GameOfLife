import type { StructureCount } from '../hooks/useGameOfLife';

// couleurs pastel pr chaque structure
const STRUCTURE_COLORS: Record<string, string> = {
  'Block': '#FFB3BA',
  'Beehive': '#FFDFBA',
  'Loaf': '#FFFFBA',
  'Blinker': '#BAFFC9',
  'Toad': '#BAE1FF',
  'Beacon': '#E0BBE4',
  'Glider': '#FFC8DD',
  'LWSS': '#A2D2FF',
};

// props du composant
interface StructureStatsProps {
  currentStructures: StructureCount;
  totalStats: StructureCount;
}

// composant pr afficher les stats de structures
export function StructureStats({ currentStructures, totalStats }: StructureStatsProps) {
  const hasAny = Object.keys(totalStats).length > 0;

  return (
    <div className="flex flex-col gap-3 p-4 bg-panel rounded-xl w-64 border border-border shadow-sm">
      <h2 className="text-sm font-semibold text-text-dark text-center">
        Structures detectees
      </h2>

      {!hasAny ? (
        <p className="text-xs text-text-light text-center">
          Aucune structure detectee
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {Object.entries(totalStats)
            .sort((a, b) => b[1] - a[1])
            .map(([name, maxCount]) => {
              const currentCount = currentStructures[name] || 0;
              const color = STRUCTURE_COLORS[name] || '#7DD3C0';
              return (
                <div key={name} className="flex justify-between items-center">
                  <span
                    className="text-xs px-2 py-1 rounded text-text-dark"
                    style={{ backgroundColor: color }}
                  >
                    {name}
                  </span>
                  <div className="flex gap-2 items-center">
                    <span className="text-xs font-bold text-text-dark">
                      {currentCount}
                    </span>
                    <span className="text-xs text-text-light">
                      (max: {maxCount})
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      <p className="text-xs text-text-light text-center mt-1">
        actuel / max durant la run
      </p>
    </div>
  );
}
