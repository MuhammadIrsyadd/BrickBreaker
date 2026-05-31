// src/components/Scoreboard.tsx
import React from 'react';

interface ScoreboardProps {
  score: number;
  highScore: number;
  lives: number;
  level: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ score, highScore, lives, level }) => {
  return (
    <div className="scoreboard">
      <div className="stat">
        <span className="label">SCORE</span>
        <span className="value">{score.toString().padStart(6, '0')}</span>
      </div>
      <div className="stat">
        <span className="label">LEVEL</span>
        <span className="value">{level}</span>
      </div>
      <div className="stat">
        <span className="label">HI-SCORE</span>
        <span className="value">{highScore.toString().padStart(6, '0')}</span>
      </div>
      <div className="stat lives">
        {[...Array(3)].map((_, i) => (
          <span key={i} className={`heart ${i < lives ? 'filled' : 'empty'}`}>❤</span>
        ))}
      </div>
    </div>
  );
};

export default Scoreboard;
