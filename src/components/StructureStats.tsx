// couleurs pastel pr chaque structure (bien distinctes)
const STRUCTURE_COLORS: Record<string, string> = {
  'Block': '#FFB3BA',
  'Beehive': '#98D8C8',
  'Loaf': '#FFFFBA',
  'Boat': '#C9B1FF',
  'Tub': '#FFD700',
  'Ship': '#87CEFA',
  'Pond': '#E6E6FA',
  'Blinker': '#BAFFC9',
  'Toad': '#FF9AA2',
  'Beacon': '#E0BBE4',
  'Clock': '#DDA0DD',
  'Pulsar': '#C9C9FF',
  'Glider': '#FFC8DD',
  'LWSS': '#A2D2FF',
  'MWSS': '#7FCDCD',
  'HWSS': '#B0E0E6',
};

// props du composant
interface StructureStatsProps {
  encounteredStructures: Set<string>;
}

// composant pr afficher les structures rencontrees
export function StructureStats({ encounteredStructures }: StructureStatsProps) {
  const structures = Array.from(encounteredStructures);

  return (
    <div className="flex flex-col gap-3 p-4 bg-panel rounded-xl w-64 border border-border shadow-sm">
      <h2 className="text-sm font-semibold text-text-dark text-center">
        Structures rencontrees
      </h2>

      {structures.length === 0 ? (
        <p className="text-xs text-text-light text-center">
          Aucune structure detectee
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {structures.map((name) => {
            const color = STRUCTURE_COLORS[name] || '#7DD3C0';
            return (
              <span
                key={name}
                className="text-xs px-2 py-1 rounded text-text-dark"
                style={{ backgroundColor: color }}
              >
                {name}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
