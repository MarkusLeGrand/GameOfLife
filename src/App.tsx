import { useGameOfLife } from './hooks/useGameOfLife';
import { Grid } from './components/Grid';
import { Controls } from './components/Controls';
import { Patterns } from './components/Patterns';
import { StructureStats } from './components/StructureStats';

function App() {
  const {
    grid,
    isRunning,
    generation,
    population,
    speed,
    currentStructures,
    structureStats,
    coloredCells,
    toggleCell,
    step,
    play,
    stop,
    reset,
    randomize,
    placePattern,
    setSpeed,
  } = useGameOfLife(50, 50);

  return (
    <div className="min-h-screen bg-warm-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Grid */}
          <div className="overflow-auto max-w-full">
            <Grid grid={grid} onCellClick={toggleCell} coloredCells={coloredCells} />
          </div>

          {/* Controls */}
          <div className="w-64 flex flex-col gap-4">
            <Controls
              isRunning={isRunning}
              generation={generation}
              population={population}
              speed={speed}
              onPlay={play}
              onStop={stop}
              onStep={step}
              onReset={reset}
              onRandomize={randomize}
              onSpeedChange={setSpeed}
            />
            <Patterns onSelectPattern={placePattern} onReset={reset} />
            <StructureStats
              currentStructures={currentStructures}
              totalStats={structureStats}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
