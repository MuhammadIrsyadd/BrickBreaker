// src/components/MenuOverlay.tsx
import React from 'react';

type GameState = 'START_MENU' | 'PLAYING' | 'PAUSED' | 'GAME_OVER' | 'LEVEL_COMPLETED' | 'GAME_CLEAR';

interface MenuOverlayProps {
  gameState: GameState;
  score: number;
  level: number;
  onStart: () => void;
  onRestart: () => void;
  onResume: () => void;
  onNextLevel: () => void;
}

const MenuOverlay: React.FC<MenuOverlayProps> = ({ 
  gameState, 
  score, 
  level, 
  onStart, 
  onRestart, 
  onResume, 
  onNextLevel 
}) => {
  if (gameState === 'PLAYING') return null;

  return (
    <div className="menu-overlay">
      <div className="menu-content">
        {gameState === 'START_MENU' && (
          <>
            <h1>RETRO BOUNCE</h1>
            <p className="subtitle">THE 25TH CHAMBER</p>
            <button onClick={onStart}>START GAME</button>
            <p className="hint">Use LEFT/RIGHT arrows or Mouse</p>
          </>
        )}

        {gameState === 'PAUSED' && (
          <>
            <h1>PAUSED</h1>
            <button onClick={onResume}>RESUME</button>
            <button onClick={onRestart}>QUIT</button>
          </>
        )}

        {gameState === 'GAME_OVER' && (
          <>
            <h1 className="danger">GAME OVER</h1>
            <p>FINAL SCORE: {score}</p>
            <p>REACHED LEVEL: {level}</p>
            <button onClick={onRestart}>TRY AGAIN</button>
          </>
        )}

        {gameState === 'LEVEL_COMPLETED' && (
          <>
            <h1 className="success">LEVEL {level} CLEAR!</h1>
            <button onClick={onNextLevel}>NEXT LEVEL</button>
          </>
        )}

        {gameState === 'GAME_CLEAR' && (
          <>
            <h1 className="success">CONGRATULATIONS!</h1>
            <p>YOU CONQUERED THE 25TH CHAMBER</p>
            <p>FINAL SCORE: {score}</p>
            <button onClick={onRestart}>PLAY AGAIN</button>
          </>
        )}
      </div>
    </div>
  );
};

export default MenuOverlay;
