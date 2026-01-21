interface ControlsProps {
  isRunning: boolean;
  generation: number;
  population: number;
  speed: number;
  onPlay: () => void;
  onStop: () => void;
  onStep: () => void;
  onReset: () => void;
  onRandomize: () => void;
  onSpeedChange: (speed: number) => void;
}

export const Controls = ({
  isRunning,
  generation,
  population,
  speed,
  onPlay,
  onStop,
  onStep,
  onReset,
  onRandomize,
  onSpeedChange,
}: ControlsProps) => {
  const buttonClass = `px-4 py-2 rounded-lg font-medium transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed`;

  return (
    <div className="flex flex-col gap-3 p-4 bg-panel rounded-xl w-64 border border-border shadow-sm">
      {/* Titre */}
      <h2 className="text-sm font-semibold text-text-dark text-center">Jeu de la Vie</h2>

      {/* Stats */}
      <div className="flex justify-around">
        <div className="text-center">
          <span className="text-text-light text-xs">Génération</span>
          <div className="text-2xl font-bold text-text-dark">{generation}</div>
        </div>
        <div className="text-center">
          <span className="text-text-light text-xs">Population</span>
          <div className="text-2xl font-bold text-mint">{population}</div>
        </div>
      </div>

      {/* Boutons principaux */}
      <div className="grid grid-cols-2 gap-2">
        {!isRunning ? (
          <button
            onClick={onPlay}
            className={`${buttonClass} bg-btn-green hover:bg-btn-green-hover text-text-dark`}
          >
            Play
          </button>
        ) : (
          <button
            onClick={onStop}
            className={`${buttonClass} bg-btn-red hover:bg-btn-red-hover text-text-dark`}
          >
            Stop
          </button>
        )}

        <button
          onClick={onStep}
          disabled={isRunning}
          className={`${buttonClass} bg-btn-blue hover:bg-btn-blue-hover text-text-dark`}
        >
          Step
        </button>

        <button
          onClick={onReset}
          className={`${buttonClass} bg-btn-gray hover:bg-btn-gray-hover text-text-dark`}
        >
          Reset
        </button>

        <button
          onClick={onRandomize}
          className={`${buttonClass} bg-btn-purple hover:bg-btn-purple-hover text-text-dark`}
        >
          Random
        </button>
      </div>

      {/* Contrôle de vitesse */}
      <div className="flex flex-col gap-1">
        <label className="text-text-light text-sm">
          Vitesse: {speed}ms
        </label>
        <input
          type="range"
          min="10"
          max="500"
          step="10"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-full h-2 bg-soft-gray rounded-lg appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-mint
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
        />
        <div className="flex justify-between text-xs text-text-light">
          <span>Rapide</span>
          <span>Lent</span>
        </div>
      </div>
    </div>
  );
};
