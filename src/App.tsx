import { useGameOfLife } from './hooks/useGameOfLife';
import { Grid } from './components/Grid';
import { Controls } from './components/Controls';
import { Patterns } from './components/Patterns';
import { StructureStats } from './components/StructureStats';

function App() {
  const {
    grid,
    isRunning,
    isReversing,
    generation,
    population,
    speed,
    encounteredStructures,
    coloredCells,
    canGoBack,
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
  } = useGameOfLife(50, 50);

  return (
    <div className="h-screen bg-warm-white p-4 overflow-hidden">
      <div className="h-full flex gap-4 items-center justify-center">
        {/* Grid */}
        <div className="shrink-0">
          <Grid grid={grid} onCellClick={toggleCell} coloredCells={coloredCells} />
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3 max-h-full overflow-y-auto">
          <Controls
            isRunning={isRunning}
            isReversing={isReversing}
            generation={generation}
            population={population}
            speed={speed}
            canGoBack={canGoBack}
            onPlay={play}
            onPlayReverse={playReverse}
            onStop={stop}
            onStep={step}
            onStepBack={stepBack}
            onReset={reset}
            onRandomize={randomize}
            onSpeedChange={setSpeed}
          />
          <Patterns onSelectPattern={placePattern} onReset={reset} />
          <StructureStats encounteredStructures={encounteredStructures} />
        </div>
      </div>
    </div>
  );
}

export default App;
