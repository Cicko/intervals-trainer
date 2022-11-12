
export type Note = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';
export type Alteration = 'None' | '#' | 'b';

export type Interval = string;



export interface IIntervalCounter {
    correct: number,
    wrong: number,
}

export type IStatisticsCounter = Record<Interval, IIntervalCounter>;


/**
 *
 * GENERIC TYPES
 *
**/

export type Accumulator<T> = T | undefined | null;
