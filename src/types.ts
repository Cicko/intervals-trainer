
export type Note = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';
export type Alteration = 'None' | '#' | 'b';


export enum GameMode {
    PITCH_DETECTION = 'PITCH_DETECTION',
    INTERVAL_GUESSING = 'INTERVAL_GUESSING',
}

export type GameModeType = keyof typeof GameMode;

export const Notes: string[] = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B'
];

export type Interval = string;


export interface IIntervalCounter {
    correct: number,
    wrong: number,
}

/**
 *
 * GENERIC TYPES
 *
**/

export type Accumulator<T> = T | undefined | null;
