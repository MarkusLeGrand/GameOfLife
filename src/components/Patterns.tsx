// raccourci pr definir les pattern plus lisible
// X = celule vivante, . = celule morte
function parsePattern(strings: string[]): boolean[][] {
  return strings.map((row) =>
    row.split('').map((char) => char === 'X')
  );
}

// couleurs pastel pr chaque structure (meme que dans le hook)
const STRUCTURE_COLORS: Record<string, string> = {
  'Block': '#FFB3BA',
  'Beehive': '#FFDFBA',
  'Loaf': '#FFFFBA',
  'Blinker': '#BAFFC9',
  'Toad': '#BAE1FF',
  'Beacon': '#E0BBE4',
  'Pulsar': '#C9C9FF',
  'Glider': '#FFC8DD',
  'LWSS': '#A2D2FF',
  'Gosper Gun': '#FFE5B4',
};

// structures emblematique du jeux de la vie
const PATTERNS = {
  // ===== STABLES (change jamais) =====
  block: {
    name: 'Block',
    category: 'Stable',
    pattern: parsePattern([
      'XX',
      'XX',
    ]),
  },
  beehive: {
    name: 'Beehive',
    category: 'Stable',
    pattern: parsePattern([
      '.XX.',
      'X..X',
      '.XX.',
    ]),
  },
  loaf: {
    name: 'Loaf',
    category: 'Stable',
    pattern: parsePattern([
      '.XX.',
      'X..X',
      '.X.X',
      '..X.',
    ]),
  },

  // ===== OSCILLATEUR (reviene a leur etat initial) =====
  blinker: {
    name: 'Blinker',
    category: 'Oscillateur',
    pattern: parsePattern([
      'XXX',
    ]),
  },
  toad: {
    name: 'Toad',
    category: 'Oscillateur',
    pattern: parsePattern([
      '.XXX',
      'XXX.',
    ]),
  },
  beacon: {
    name: 'Beacon',
    category: 'Oscillateur',
    pattern: parsePattern([
      'XX..',
      'XX..',
      '..XX',
      '..XX',
    ]),
  },
  pulsar: {
    name: 'Pulsar',
    category: 'Oscillateur',
    pattern: parsePattern([
      '..XXX...XXX..',
      '.............',
      'X....X.X....X',
      'X....X.X....X',
      'X....X.X....X',
      '..XXX...XXX..',
      '.............',
      '..XXX...XXX..',
      'X....X.X....X',
      'X....X.X....X',
      'X....X.X....X',
      '.............',
      '..XXX...XXX..',
    ]),
  },

  // ===== VAISSEAUX (se deplace) =====
  glider: {
    name: 'Glider',
    category: 'Vaisseau',
    pattern: parsePattern([
      '.X.',
      '..X',
      'XXX',
    ]),
  },
  lwss: {
    name: 'LWSS',
    category: 'Vaisseau',
    pattern: parsePattern([
      'X..X.',
      '....X',
      'X...X',
      '.XXXX',
    ]),
  },

  // ===== GENERATEUR (cree des vaisseaux) =====
  gliderGun: {
    name: 'Gosper Gun',
    category: 'Générateur',
    pattern: parsePattern([
      '........................X...........',
      '......................X.X...........',
      '............XX......XX............XX',
      '...........X...X....XX............XX',
      'XX........X.....X...XX..............',
      'XX........X...X.XX....X.X...........',
      '..........X.....X.......X...........',
      '...........X...X....................',
      '............XX......................',
    ]),
  },
};

// props du composant
interface PatternsProps {
  onSelectPattern: (pattern: boolean[][]) => void;
  onReset: () => void;
}

// composant pr selectionner un pattern
export function Patterns({ onSelectPattern, onReset }: PatternsProps) {
  const categories = ['Stable', 'Oscillateur', 'Vaisseau', 'Générateur'];

  // selectionne un pattern : reset la grile puis place le pattern
  function handleSelect(pattern: boolean[][]) {
    onReset();
    onSelectPattern(pattern);
  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-panel rounded-xl w-64 border border-border shadow-sm">
      <h2 className="text-sm font-semibold text-text-dark text-center">
        Structures
      </h2>

      {categories.map((category) => (
        <div key={category} className="flex flex-col gap-1">
          <span className="text-xs text-text-light">{category}s</span>
          <div className="flex flex-wrap gap-1">
            {Object.entries(PATTERNS)
              .filter(([, p]) => p.category === category)
              .map(([key, p]) => {
                const bgColor = STRUCTURE_COLORS[p.name] || '#F0EEEC';
                return (
                  <button
                    key={key}
                    onClick={() => handleSelect(p.pattern)}
                    style={{ backgroundColor: bgColor }}
                    className="px-2 py-1 text-xs text-text-dark hover:opacity-80 rounded transition-opacity"
                  >
                    {p.name}
                  </button>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
