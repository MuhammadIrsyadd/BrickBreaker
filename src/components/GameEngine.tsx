// src/components/GameEngine.tsx
import React, { useEffect, useRef, useState } from 'react';
import { getLevel, BRICK_CONFIG } from '../utils/levelsConfiguration';
import type { BrickType } from '../utils/levelsConfiguration';
import { audio } from '../utils/audioGenerator';
import { useKeyPress } from '../hooks/useKeyPress';
import Scoreboard from './Scoreboard';
import MenuOverlay from './MenuOverlay';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PADDLE_WIDTH = 120;
const PADDLE_HEIGHT = 15;
const PADDLE_SPEED = 8;
const BALL_RADIUS = 8;

type GameState = 'START_MENU' | 'PLAYING' | 'PAUSED' | 'GAME_OVER' | 'LEVEL_COMPLETED' | 'GAME_CLEAR';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
}

const GameEngine: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>('START_MENU');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);

  // Keyboard controls
  const leftPressed = useKeyPress('ArrowLeft');
  const rightPressed = useKeyPress('ArrowRight');

  // Mutable game state (for performance)
  const ballPos = useRef({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 50 });
  const ballVel = useRef({ dx: 4, dy: -4 });
  const paddleX = useRef((CANVAS_WIDTH - PADDLE_WIDTH) / 2);
  const bricks = useRef<{ type: BrickType, hp: number, x: number, y: number, w: number, h: number }[][]>([]);
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const shakeTime = useRef(0);

  useEffect(() => {
    const saved = localStorage.getItem('retro_bounce_highscore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('retro_bounce_highscore', score.toString());
    }
  }, [score, highScore]);

  const initLevel = (lvl: number) => {
    const grid = getLevel(lvl);
    const brickW = CANVAS_WIDTH / grid[0].length;
    const brickH = 30;
    bricks.current = grid.map((row, r) => 
      row.map((type, c) => ({
        type,
        hp: type === 9 ? Infinity : (BRICK_CONFIG[type as keyof typeof BRICK_CONFIG]?.hp || 0),
        x: c * brickW,
        y: r * brickH + 60,
        w: brickW - 4,
        h: brickH - 4
      }))
    );
    resetBall();
  };

  const resetBall = () => {
    ballPos.current = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 50 };
    const speed = 4 + (level * 0.1);
    ballVel.current = { dx: (Math.random() - 0.5) * speed, dy: -speed };
  };

  const handleStart = () => {
    setScore(0);
    setLevel(1);
    setLives(3);
    initLevel(1);
    setGameState('PLAYING');
  };

  const handleNextLevel = () => {
    if (level === 25) {
      setGameState('GAME_CLEAR');
    } else {
      const nextLvl = level + 1;
      setLevel(nextLvl);
      initLevel(nextLvl);
      setGameState('PLAYING');
    }
  };

  const handleRestart = () => {
    setGameState('START_MENU');
  };

  const spawnParticles = (x: number, y: number, color: string) => {
    for (let i = 0; i < 10; i++) {
      particles.current.push({
        x, y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        color,
        life: 1.0
      });
    }
  };

  const update = () => {
    if (gameState !== 'PLAYING') return;

    // Update particles
    particles.current = particles.current.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1; // Gravity
      p.life -= 0.02;
      return p.life > 0;
    });

    // Update screen shake
    if (shakeTime.current > 0) shakeTime.current -= 16;

    // Paddle movement (Keyboard)
    if (leftPressed) {
      paddleX.current = Math.max(0, paddleX.current - PADDLE_SPEED);
    }
    if (rightPressed) {
      paddleX.current = Math.min(CANVAS_WIDTH - PADDLE_WIDTH, paddleX.current + PADDLE_SPEED);
    }

    // Ball movement
    ballPos.current.x += ballVel.current.dx;
    ballPos.current.y += ballVel.current.dy;

    // Wall collisions
    if (ballPos.current.x + BALL_RADIUS > CANVAS_WIDTH || ballPos.current.x - BALL_RADIUS < 0) {
      ballVel.current.dx *= -1;
      audio.playBounce();
    }
    if (ballPos.current.y - BALL_RADIUS < 0) {
      ballVel.current.dy *= -1;
      audio.playBounce();
    }

    // Paddle collision
    if (
      ballPos.current.y + BALL_RADIUS > CANVAS_HEIGHT - 40 - PADDLE_HEIGHT &&
      ballPos.current.y - BALL_RADIUS < CANVAS_HEIGHT - 40 &&
      ballPos.current.x > paddleX.current &&
      ballPos.current.x < paddleX.current + PADDLE_WIDTH
    ) {
      // Dynamic bounce angle
      const hitPos = (ballPos.current.x - (paddleX.current + PADDLE_WIDTH / 2)) / (PADDLE_WIDTH / 2);
      const speed = Math.sqrt(ballVel.current.dx ** 2 + ballVel.current.dy ** 2);
      ballVel.current.dx = hitPos * speed * 0.8;
      ballVel.current.dy = -Math.sqrt(Math.max(0, speed ** 2 - ballVel.current.dx ** 2));
      audio.playPaddleHit();
    }

    // Bottom collision (Life lost)
    if (ballPos.current.y + BALL_RADIUS > CANVAS_HEIGHT) {
      if (lives > 1) {
        setLives(l => l - 1);
        resetBall();
      } else {
        setLives(0);
        setGameState('GAME_OVER');
        audio.playGameOver();
      }
    }

    // Brick collisions
    let allCleared = true;
    bricks.current.forEach(row => {
      row.forEach(brick => {
        if (brick.type !== 0 && brick.hp > 0) {
          if (brick.type !== 9) allCleared = false;
          
          if (
            ballPos.current.x + BALL_RADIUS > brick.x &&
            ballPos.current.x - BALL_RADIUS < brick.x + brick.w &&
            ballPos.current.y + BALL_RADIUS > brick.y &&
            ballPos.current.y - BALL_RADIUS < brick.y + brick.h
          ) {
            // Collision detection (simple side check)
            const overlapX = Math.min(ballPos.current.x + BALL_RADIUS - brick.x, brick.x + brick.w - (ballPos.current.x - BALL_RADIUS));
            const overlapY = Math.min(ballPos.current.y + BALL_RADIUS - brick.y, brick.y + brick.h - (ballPos.current.y - BALL_RADIUS));

            if (overlapX < overlapY) {
              ballVel.current.dx *= -1;
            } else {
              ballVel.current.dy *= -1;
            }

            if (brick.type !== 9) {
              brick.hp -= 1;
              if (brick.hp <= 0) {
                const config = BRICK_CONFIG[brick.type as keyof typeof BRICK_CONFIG];
                setScore(s => s + config.points);
                spawnParticles(brick.x + brick.w / 2, brick.y + brick.h / 2, config.color);
                audio.playBrickShatter();
                if (brick.type === 4) shakeTime.current = 150;
              } else {
                // Change type/color based on HP
                if (brick.hp === 1) brick.type = 1;
                else if (brick.hp === 2) brick.type = 2;
                else if (brick.hp === 3) brick.type = 3;
                audio.playBounce();
              }
            } else {
              audio.playBounce();
            }
          }
        }
      });
    });

    if (allCleared) {
      setGameState('LEVEL_COMPLETED');
      audio.playLevelComplete();
    }
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Apply screen shake
    ctx.save();
    if (shakeTime.current > 0) {
      ctx.translate((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
    }

    // Draw Bricks
    bricks.current.forEach(row => {
      row.forEach(brick => {
        if (brick.type !== 0 && brick.hp > 0) {
          ctx.fillStyle = BRICK_CONFIG[brick.type as keyof typeof BRICK_CONFIG].color;
          ctx.fillRect(brick.x, brick.y, brick.w, brick.h);
          // 8-bit border
          ctx.strokeStyle = 'rgba(255,255,255,0.3)';
          ctx.lineWidth = 2;
          ctx.strokeRect(brick.x, brick.y, brick.w, brick.h);
        }
      });
    });

    // Draw Paddle
    ctx.fillStyle = '#00FFFF';
    ctx.fillRect(paddleX.current, CANVAS_HEIGHT - 40, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.strokeStyle = '#FFFFFF';
    ctx.strokeRect(paddleX.current, CANVAS_HEIGHT - 40, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw Ball
    ctx.beginPath();
    ctx.arc(ballPos.current.x, ballPos.current.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.closePath();

    // Draw Particles
    particles.current.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 4, 4);
    });
    ctx.globalAlpha = 1.0;

    ctx.restore();

    // CRT Scanlines Effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    for (let i = 0; i < CANVAS_HEIGHT; i += 4) {
      ctx.fillRect(0, i, CANVAS_WIDTH, 1);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = () => {
      update();
      draw(ctx);
      animationFrameId.current = requestAnimationFrame(gameLoop);
    };

    animationFrameId.current = requestAnimationFrame(gameLoop);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      paddleX.current = Math.max(0, Math.min(CANVAS_WIDTH - PADDLE_WIDTH, x - PADDLE_WIDTH / 2));
    };

    const handleTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      paddleX.current = Math.max(0, Math.min(CANVAS_WIDTH - PADDLE_WIDTH, x - PADDLE_WIDTH / 2));
      e.preventDefault();
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [gameState, level, lives]);

  return (
    <div className="game-container">
      <Scoreboard score={score} highScore={highScore} lives={lives} level={level} />
      <div className="canvas-wrapper">
        <canvas 
          ref={canvasRef} 
          width={CANVAS_WIDTH} 
          height={CANVAS_HEIGHT}
          className="game-canvas"
        />
        <MenuOverlay 
          gameState={gameState}
          score={score}
          level={level}
          onStart={handleStart}
          onRestart={handleRestart}
          onResume={() => setGameState('PLAYING')}
          onNextLevel={handleNextLevel}
        />
      </div>
    </div>
  );
};

export default GameEngine;
