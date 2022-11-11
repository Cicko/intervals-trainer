
export type Note = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';
export type Alteration = 'None' | '#' | 'b';

export type Interval =
    '2m' |
    '2M' |
    '3m' |
    '3M' |
    '4P' |
    'TT' |
    '5P' |
    '6m' |
    '6M' |
    '7m' |
    '7M' |
    '8P';



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
