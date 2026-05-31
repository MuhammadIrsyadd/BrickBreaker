// src/utils/levelsConfiguration.ts

export type BrickType = 0 | 1 | 2 | 3 | 4 | 9;

export interface LevelData {
  grid: BrickType[][];
  speed: number;
}

export const LEVELS: Record<number, BrickType[][]> = {
  // Level 1: Pengenalan dasar mudah
  1: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],

  // Level 5: Akhir Zona 1
  5: [
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ],

  // Level 10: Pola Piramida dengan ketahanan berlapis (Akhir Zona 2)
  10: [
    [0, 0, 0, 0, 3, 3, 0, 0, 0, 0],
    [0, 0, 0, 2, 2, 2, 2, 0, 0, 0],
    [0, 0, 2, 1, 1, 1, 1, 2, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0]
  ],

  // Level 15: High Density (Akhir Zona 3)
  15: [
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ],

  // Level 18: Penggunaan rintangan Baja (9)
  18: [
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    [9, 9, 0, 0, 0, 0, 0, 0, 9, 9], 
    [2, 2, 2, 2, 9, 9, 2, 2, 2, 2],
    [1, 1, 1, 1, 0, 0, 1, 1, 1, 1]
  ],

  // Level 20: Iron Fortress (Akhir Zona 4)
  20: [
    [9, 3, 3, 3, 3, 3, 3, 3, 3, 9],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 4, 4, 4, 9, 9, 4, 4, 4, 9],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 9]
  ],

  // Level 25: Boss Terakhir - Space Invader Silhouette
  25: [
    [0, 0, 4, 0, 0, 0, 0, 4, 0, 0],
    [0, 0, 0, 4, 4, 4, 4, 0, 0, 0],
    [0, 0, 4, 9, 4, 4, 9, 4, 0, 0], 
    [0, 4, 4, 4, 4, 4, 4, 4, 4, 0],
    [0, 4, 0, 4, 4, 4, 4, 0, 4, 0],
    [0, 0, 0, 4, 0, 0, 4, 0, 0, 0]
  ]
};

// Helper function to fill missing levels with procedural patterns
export const getLevel = (level: number): BrickType[][] => {
  if (LEVELS[level]) return LEVELS[level];

  // Procedural generation for missing levels
  const grid: BrickType[][] = [];
  const rows = Math.min(4 + Math.floor(level / 5), 8);
  const cols = 10;
  
  for (let r = 0; r < rows; r++) {
    const row: BrickType[] = [];
    for (let c = 0; c < cols; c++) {
      // Logic based on level zone
      if (level <= 5) {
        row.push(Math.random() > 0.3 ? 1 : 2);
      } else if (level <= 10) {
        row.push(Math.random() > 0.4 ? 2 : 3);
      } else if (level <= 15) {
        row.push(Math.random() > 0.5 ? 3 : 4);
      } else {
        const rand = Math.random();
        if (rand > 0.8) row.push(9);
        else if (rand > 0.4) row.push(4);
        else row.push(3);
      }
    }
    grid.push(row);
  }
  return grid;
};

export const BRICK_CONFIG = {
  1: { color: '#FF0055', hp: 1, points: 100, label: 'Neon Red' },
  2: { color: '#00FF66', hp: 2, points: 250, label: 'Neon Green' },
  3: { color: '#0066FF', hp: 3, points: 450, label: 'Electric Blue' },
  4: { color: '#FFFF00', hp: 4, points: 700, label: 'Retro Yellow' },
  9: { color: '#888888', hp: Infinity, points: 0, label: 'Steel Grey' }
};
