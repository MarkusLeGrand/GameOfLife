import { useState, useCallback, useRef, useEffect } from 'react';

export type Grid = boolean[][];

// type pr le compteur de structures
export type StructureCount = Record<string, number>;

// type pr les celules colorees (pos -> couleur)
export type ColoredCells = Record<string, string>;

// couleurs pastel pr chaque structure (bien distinctes)
const STRUCTURE_COLORS: Record<string, string> = {
  'Block': '#FFB3BA',     // rose pastel
  'Beehive': '#98D8C8',   // turquoise pastel
  'Loaf': '#FFFFBA',      // jaune pastel
  'Boat': '#C9B1FF',      // violet clair
  'Tub': '#FFD700',       // or
  'Ship': '#87CEFA',      // bleu ciel clair
  'Pond': '#E6E6FA',      // lavande
  'Blinker': '#BAFFC9',   // vert pastel
  'Toad': '#FF9AA2',      // corail
  'Beacon': '#E0BBE4',    // violet pastel
  'Clock': '#DDA0DD',     // plum
  'Pulsar': '#C9C9FF',    // lavande pastel
  'Glider': '#FFC8DD',    // rose bonbon
  'LWSS': '#A2D2FF',      // bleu ciel
  'MWSS': '#7FCDCD',      // teal clair
  'HWSS': '#B0E0E6',      // powder blue
};

// structure pr stocker un pattern avec sa taille
type PatternVariant = {
  str: string;
  height: number;
  width: number;
};

// patterns connus a detecter
const KNOWN_PATTERNS: { name: string; variants: PatternVariant[]; size: number }[] = [];

// convertit un pattern 2d en string
function patternToString(p: boolean[][]): string {
  return p.map(row => row.map(c => c ? '1' : '0').join('')).join('|');
}

// fait une rotation 90deg
function rotate90(p: boolean[][]): boolean[][] {
  const rows = p.length;
  const cols = p[0].length;
  const rotated: boolean[][] = [];
  for (let j = 0; j < cols; j++) {
    const newRow: boolean[] = [];
    for (let i = rows - 1; i >= 0; i--) {
      newRow.push(p[i][j]);
    }
    rotated.push(newRow);
  }
  return rotated;
}

// flip horizontal
function flipH(p: boolean[][]): boolean[][] {
  return p.map(row => [...row].reverse());
}

// calcul la taille dun pattern (nb de celule vivante)
function patternSize(p: boolean[][]): number {
  let count = 0;
  for (const row of p) {
    for (const cell of row) {
      if (cell) count++;
    }
  }
  return count;
}

// genere toutes les variantes dun pattern avec leur taille
function getAllVariantsWithSize(p: boolean[][]): PatternVariant[] {
  const variants: PatternVariant[] = [];
  const seen: Set<string> = new Set();
  let current = p;

  // 4 rotations
  for (let i = 0; i < 4; i++) {
    const str1 = patternToString(current);
    if (!seen.has(str1)) {
      seen.add(str1);
      variants.push({ str: str1, height: current.length, width: current[0].length });
    }

    const flipped = flipH(current);
    const str2 = patternToString(flipped);
    if (!seen.has(str2)) {
      seen.add(str2);
      variants.push({ str: str2, height: flipped.length, width: flipped[0].length });
    }

    current = rotate90(current);
  }

  return variants;
}

// init les patterns connu
function initPatterns() {
  if (KNOWN_PATTERNS.length > 0) return;

  // patterns avec toutes leurs formes (oscillateur ont plusieurs phases)
  const patterns: { name: string; patterns: boolean[][][] }[] = [
    // stables
    { name: 'Block', patterns: [[[true,true],[true,true]]] },
    { name: 'Beehive', patterns: [[
      [false,true,true,false],
      [true,false,false,true],
      [false,true,true,false]
    ]]},
    { name: 'Loaf', patterns: [[
      [false,true,true,false],
      [true,false,false,true],
      [false,true,false,true],
      [false,false,true,false]
    ]]},
    { name: 'Boat', patterns: [[
      [true,true,false],
      [true,false,true],
      [false,true,false]
    ]]},
    { name: 'Tub', patterns: [[
      [false,true,false],
      [true,false,true],
      [false,true,false]
    ]]},
    { name: 'Ship', patterns: [[
      [true,true,false],
      [true,false,true],
      [false,true,true]
    ]]},
    { name: 'Pond', patterns: [[
      [false,true,true,false],
      [true,false,false,true],
      [true,false,false,true],
      [false,true,true,false]
    ]]},
    // oscillateurs avec leurs differentes phases
    { name: 'Blinker', patterns: [
      [[true,true,true]], // horizontal
      [[true],[true],[true]] // vertical
    ]},
    { name: 'Toad', patterns: [
      // phase 1
      [[false,true,true,true],[true,true,true,false]],
      // phase 2
      [[false,false,true,false],[true,false,false,true],[true,false,false,true],[false,true,false,false]]
    ]},
    { name: 'Beacon', patterns: [
      // phase 1 complete
      [[true,true,false,false],[true,true,false,false],[false,false,true,true],[false,false,true,true]],
      // phase 2 (coins manquant)
      [[true,true,false,false],[true,false,false,false],[false,false,false,true],[false,false,true,true]]
    ]},
    { name: 'Clock', patterns: [
      // phase 1
      [[false,true,false,false],[false,false,true,true],[true,true,false,false],[false,false,true,false]],
      // phase 2
      [[false,false,true,false],[true,true,true,false],[false,true,true,true],[false,true,false,false]]
    ]},
    // vaisseaux (4 phases chacun)
    { name: 'Glider', patterns: [
      [[false,true,false],[false,false,true],[true,true,true]],
      [[true,false,true],[false,true,true],[false,true,false]],
      [[false,false,true],[true,false,true],[false,true,true]],
      [[true,false,false],[false,true,true],[true,true,false]]
    ]},
    { name: 'LWSS', patterns: [
      [[true,false,false,true,false],[false,false,false,false,true],[true,false,false,false,true],[false,true,true,true,true]],
      [[false,false,true,true,false],[true,true,false,true,true],[true,true,true,true,false],[false,true,true,false,false]],
      [[true,true,true,true,false],[true,false,false,false,true],[false,false,false,false,true],[true,false,false,true,false]],
      [[false,true,true,false,false],[true,true,true,true,false],[true,true,false,true,true],[false,false,true,true,false]]
    ]},
    { name: 'MWSS', patterns: [
      [[false,false,true,false,false,false],[true,false,false,false,true,false],[false,false,false,false,false,true],[true,false,false,false,false,true],[false,true,true,true,true,true]]
    ]},
    { name: 'HWSS', patterns: [
      [[false,false,true,true,false,false,false],[true,false,false,false,false,true,false],[false,false,false,false,false,false,true],[true,false,false,false,false,false,true],[false,true,true,true,true,true,true]]
    ]},
  ];

  // collecte toutes les variantes de chaque pattern
  for (const p of patterns) {
    const allVariants: PatternVariant[] = [];
    const seen: Set<string> = new Set();
    let size = 0;

    for (const pat of p.patterns) {
      const variants = getAllVariantsWithSize(pat);
      for (const v of variants) {
        if (!seen.has(v.str)) {
          seen.add(v.str);
          allVariants.push(v);
        }
      }
      size = Math.max(size, patternSize(pat));
    }

    KNOWN_PATTERNS.push({
      name: p.name,
      variants: allVariants,
      size: size
    });
  }

  // trie par taille decroissante (plus grand en premier pr priorite)
  KNOWN_PATTERNS.sort((a, b) => b.size - a.size);
}

// map rapide: str -> { name, height, width, size }
let PATTERN_MAP: Map<string, { name: string; height: number; width: number; size: number }> | null = null;

function getPatternMap() {
  if (PATTERN_MAP) return PATTERN_MAP;
  initPatterns();
  PATTERN_MAP = new Map();
  for (const p of KNOWN_PATTERNS) {
    for (const v of p.variants) {
      // garde le plus grand si doublon
      const existing = PATTERN_MAP.get(v.str);
      if (!existing || p.size > existing.size) {
        PATTERN_MAP.set(v.str, { name: p.name, height: v.height, width: v.width, size: p.size });
      }
    }
  }
  return PATTERN_MAP;
}

// verifie si une zone est isolee (pas de voisin vivant autour)
function isIsolated(grid: Grid, startR: number, startC: number, height: number, width: number): boolean {
  const rows = grid.length;
  const cols = grid[0].length;

  // check bordure du haut
  if (startR > 0) {
    for (let c = startC - 1; c <= startC + width; c++) {
      if (c >= 0 && c < cols && grid[startR - 1][c]) return false;
    }
  }
  // check bordure du bas
  if (startR + height < rows) {
    for (let c = startC - 1; c <= startC + width; c++) {
      if (c >= 0 && c < cols && grid[startR + height][c]) return false;
    }
  }
  // check bordure gauche
  if (startC > 0) {
    for (let r = startR; r < startR + height; r++) {
      if (r >= 0 && r < rows && grid[r][startC - 1]) return false;
    }
  }
  // check bordure droite
  if (startC + width < cols) {
    for (let r = startR; r < startR + height; r++) {
      if (r >= 0 && r < rows && grid[r][startC + width]) return false;
    }
  }

  return true;
}

// detecte les structures sur la grile + retourne les celules coloree
function detectStructures(grid: Grid): { counts: Record<string, number>; colors: ColoredCells } {
  const patternMap = getPatternMap();
  const found: Record<string, number> = {};
  const coloredCells: ColoredCells = {};
  const rows = grid.length;
  const cols = grid[0].length;
  const matched: Set<string> = new Set();

  // tailles a tester (triee par taille decroissante pr priorite)
  const sizes = [
    { h: 5, w: 7 }, { h: 7, w: 5 }, // HWSS
    { h: 5, w: 6 }, { h: 6, w: 5 }, // MWSS
    { h: 4, w: 5 }, { h: 5, w: 4 }, // LWSS
    { h: 4, w: 4 }, // Beacon, Loaf, Pond, Clock
    { h: 3, w: 4 }, { h: 4, w: 3 }, // Beehive, Toad
    { h: 3, w: 3 }, // Glider, Boat, Tub, Ship
    { h: 2, w: 4 }, { h: 4, w: 2 }, // Toad phase 2
    { h: 2, w: 2 }, // Block
    { h: 1, w: 3 }, { h: 3, w: 1 }, // Blinker
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!grid[r][c]) continue;
      if (matched.has(`${r},${c}`)) continue;

      // essaye chaque taille
      for (const { h, w } of sizes) {
        // essaye les positions possibles qui contiennent (r,c)
        for (let dr = 0; dr < h; dr++) {
          for (let dc = 0; dc < w; dc++) {
            const startR = r - dr;
            const startC = c - dc;
            if (startR < 0 || startC < 0) continue;
            if (startR + h > rows || startC + w > cols) continue;

            // extrait et cherche dans la map
            let subStr = '';
            for (let i = 0; i < h; i++) {
              if (i > 0) subStr += '|';
              for (let j = 0; j < w; j++) {
                subStr += grid[startR + i][startC + j] ? '1' : '0';
              }
            }

            const match = patternMap.get(subStr);
            if (!match) continue;

            // verifie pas deja matche
            let alreadyMatched = false;
            for (let i = 0; i < h && !alreadyMatched; i++) {
              for (let j = 0; j < w && !alreadyMatched; j++) {
                if (grid[startR + i][startC + j] && matched.has(`${startR+i},${startC+j}`)) {
                  alreadyMatched = true;
                }
              }
            }
            if (alreadyMatched) continue;

            // verifie isolation
            if (!isIsolated(grid, startR, startC, h, w)) continue;

            // match valide !
            const color = STRUCTURE_COLORS[match.name] || '#7DD3C0';
            for (let i = 0; i < h; i++) {
              for (let j = 0; j < w; j++) {
                if (grid[startR + i][startC + j]) {
                  const key = `${startR+i},${startC+j}`;
                  matched.add(key);
                  coloredCells[key] = color;
                }
              }
            }
            found[match.name] = (found[match.name] || 0) + 1;
          }
        }
      }
    }
  }

  return { counts: found, colors: coloredCells };
}

// cree une grile vide
function createEmptyGrid(rows: number, cols: number): Grid {
  const grid: Grid = [];
  for (let i = 0; i < rows; i++) {
    const row: boolean[] = [];
    for (let j = 0; j < cols; j++) {
      row.push(false);
    }
    grid.push(row);
  }
  return grid;
}

// cree une grile avec 30% de celules vivante
function createRandomGrid(rows: number, cols: number): Grid {
  const grid: Grid = [];
  for (let i = 0; i < rows; i++) {
    const row: boolean[] = [];
    for (let j = 0; j < cols; j++) {
      const isAlive = Math.random() > 0.7; // 30% de chanc
      row.push(isAlive);
    }
    grid.push(row);
  }
  return grid;
}

// compte les voisin vivant dune celule
function countNeighbors(grid: Grid, row: number, col: number): number {
  const totalRows = grid.length;
  const totalCols = grid[0].length;
  let count = 0;

  // parcour les 8 case autour
  for (let deltaRow = -1; deltaRow <= 1; deltaRow++) {
    for (let deltaCol = -1; deltaCol <= 1; deltaCol++) {
      // ignore la celule elle meme
      if (deltaRow === 0 && deltaCol === 0) continue;

      const neighborRow = row + deltaRow;
      const neighborCol = col + deltaCol;

      // verifie que le voisin est ds la grile
      const isInBounds =
        neighborRow >= 0 &&
        neighborRow < totalRows &&
        neighborCol >= 0 &&
        neighborCol < totalCols;

      if (isInBounds && grid[neighborRow][neighborCol]) {
        count++;
      }
    }
  }

  return count;
}

// calcul la prochaine generation selon les regle de conway
function computeNextGeneration(grid: Grid): Grid {
  const rows = grid.length;
  const cols = grid[0].length;
  const newGrid = createEmptyGrid(rows, cols);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const neighbors = countNeighbors(grid, row, col);
      const isAlive = grid[row][col];

      // regles du jeu de la vie :
      // celule vivante avec 2 ou 3 voisin survit
      // celule morte avec 3 voisin nait
      // sinon la celule meurt ou reste morte
      if (isAlive) {
        newGrid[row][col] = neighbors === 2 || neighbors === 3;
      } else {
        newGrid[row][col] = neighbors === 3;
      }
    }
  }

  return newGrid;
}

// hook principal du jeux de la vie
export function useGameOfLife(initialRows: number = 30, initialCols: number = 50) {
  // etat
  const [rows, setRows] = useState(initialRows);
  const [cols, setCols] = useState(initialCols);
  const [grid, setGrid] = useState<Grid>(() => createEmptyGrid(initialRows, initialCols));
  const [isRunning, setIsRunning] = useState(false);
  const [isReversing, setIsReversing] = useState(false); // joue en arriere
  const [generation, setGeneration] = useState(0);
  const [speed, setSpeed] = useState(333); // en ms (3 gen/s)
  const [encounteredStructures, setEncounteredStructures] = useState<Set<string>>(new Set()); // structures rencontrees
  const [history, setHistory] = useState<Grid[]>([]); // historique des generations

  // refs pr acceder aux valeur actuel ds les callback
  const runningRef = useRef(isRunning);
  runningRef.current = isRunning;

  const reversingRef = useRef(isReversing);
  reversingRef.current = isReversing;

  const speedRef = useRef(speed);
  speedRef.current = speed;

  const historyRef = useRef(history);
  historyRef.current = history;

  const generationRef = useRef(generation);
  generationRef.current = generation;

  const gridRef = useRef(grid);
  gridRef.current = grid;

  // compte la pop (celules vivante)
  const population = grid.flat().filter(Boolean).length;

  // detecte les structures actuelles sur la grile
  const { counts: currentStructures, colors: coloredCells } = detectStructures(grid);

  // toggle une celule (vivante morte)
  const toggleCell = useCallback((row: number, col: number) => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((r) => [...r]);
      newGrid[row][col] = !newGrid[row][col];
      return newGrid;
    });
  }, []);

  // avance dune generation (sauvegarde historique)
  const step = useCallback(() => {
    // sauvegarde la grille actuelle AVANT de la modifier
    const currentGrid = gridRef.current;
    const newHistory = [...historyRef.current, currentGrid];
    if (newHistory.length > 1000) newHistory.shift();
    historyRef.current = newHistory;
    setHistory(newHistory);

    // calcule et applique la nouvelle generation
    const nextGrid = computeNextGeneration(currentGrid);
    gridRef.current = nextGrid;
    setGrid(nextGrid);

    // update generation
    const newGen = generationRef.current + 1;
    generationRef.current = newGen;
    setGeneration(newGen);
  }, []);

  // recule d'une generation
  const stepBack = useCallback(() => {
    if (historyRef.current.length === 0) return;

    // recupere la derniere grille de l'historique
    const newHistory = [...historyRef.current];
    const previousGrid = newHistory.pop()!;

    // update refs immediatement
    historyRef.current = newHistory;
    setHistory(newHistory);

    gridRef.current = previousGrid;
    setGrid(previousGrid);

    const newGen = Math.max(0, generationRef.current - 1);
    generationRef.current = newGen;
    setGeneration(newGen);
  }, []);

  // boucle de simul avant
  const run = useCallback(() => {
    if (!runningRef.current) return;
    step();
    setTimeout(run, speedRef.current);
  }, [step]);

  // boucle de simul arriere (s'arrete a generation 0)
  const runReverse = useCallback(() => {
    if (!reversingRef.current) return;

    // arrete si generation 0 ou pas d'historique
    if (generationRef.current <= 0 || historyRef.current.length === 0) {
      setIsReversing(false);
      return;
    }

    // si on va arriver a generation 0, on fait le step et on arrete
    const willReachZero = generationRef.current === 1;
    stepBack();

    if (willReachZero) {
      setIsReversing(false);
      return;
    }

    setTimeout(runReverse, speedRef.current);
  }, [stepBack]);

  // demarre la simul avant
  const play = useCallback(() => {
    setIsReversing(false);
    setIsRunning(true);
  }, []);

  // demarre la simul arriere
  const playReverse = useCallback(() => {
    setIsRunning(false);
    setIsReversing(true);
  }, []);

  // arrete la simul
  const stop = useCallback(() => {
    setIsRunning(false);
    setIsReversing(false);
  }, []);

  // remet a zero
  const reset = useCallback(() => {
    setIsRunning(false);
    setIsReversing(false);
    setGrid(createEmptyGrid(rows, cols));
    setGeneration(0);
    setEncounteredStructures(new Set());
    setHistory([]);
  }, [rows, cols]);

  // genere une grile aleatoir
  const randomize = useCallback(() => {
    setIsRunning(false);
    setIsReversing(false);
    setGrid(createRandomGrid(rows, cols));
    setGeneration(0);
    setEncounteredStructures(new Set());
    setHistory([]);
  }, [rows, cols]);

  // place un pattern au centre (ou a une pos donnee)
  const placePattern = useCallback(
    (pattern: boolean[][], centerRow?: number, centerCol?: number) => {
      setGrid((prevGrid) => {
        const newGrid = prevGrid.map((r) => [...r]);
        const patternHeight = pattern.length;
        const patternWidth = pattern[0].length;

        // pos de depart (centre par defaut)
        const startRow = centerRow ?? Math.floor((rows - patternHeight) / 2);
        const startCol = centerCol ?? Math.floor((cols - patternWidth) / 2);

        // copie le pattern dans la grile
        for (let i = 0; i < patternHeight; i++) {
          for (let j = 0; j < patternWidth; j++) {
            const targetRow = startRow + i;
            const targetCol = startCol + j;

            const isInBounds =
              targetRow >= 0 &&
              targetRow < rows &&
              targetCol >= 0 &&
              targetCol < cols;

            if (isInBounds) {
              newGrid[targetRow][targetCol] = pattern[i][j];
            }
          }
        }

        return newGrid;
      });
      setGeneration(0);
    },
    [rows, cols]
  );

  // change la taille de la grile
  const updateSize = useCallback((newRows: number, newCols: number) => {
    setRows(newRows);
    setCols(newCols);
    setGrid(createEmptyGrid(newRows, newCols));
    setGeneration(0);
    setIsRunning(false);
  }, []);

  // lance la simul avant quand isRunning passe a true
  useEffect(() => {
    if (isRunning) {
      const timeoutId = setTimeout(run, speedRef.current);
      return () => clearTimeout(timeoutId);
    }
  }, [isRunning, run]);

  // lance la simul arriere quand isReversing passe a true
  useEffect(() => {
    if (isReversing) {
      const timeoutId = setTimeout(runReverse, speedRef.current);
      return () => clearTimeout(timeoutId);
    }
  }, [isReversing, runReverse]);

  // update les structures rencontrees a chaque changement de grile
  useEffect(() => {
    const { counts } = detectStructures(grid);

    // ajoute les nouvelles structures rencontrees
    const names = Object.keys(counts);
    if (names.length > 0) {
      setEncounteredStructures(prev => {
        const updated = new Set(prev);
        for (const name of names) {
          updated.add(name);
        }
        return updated;
      });
    }
  }, [grid]);

  return {
    // etat
    grid,
    isRunning,
    isReversing,
    generation,
    population,
    speed,
    rows,
    cols,
    currentStructures, // structures detectee maintenant
    encounteredStructures, // structures rencontrees durant la run
    coloredCells, // celules coloree par structure
    canGoBack: history.length > 0, // peut reculer?
    // action
    toggleCell,
    step,
    stepBack,
    play,
    playReverse,
    stop,
    reset,
    randomize,
    placePattern,
    setSpeed,
    updateSize,
  };
}
