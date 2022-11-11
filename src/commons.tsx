import * as React from 'react';
import { IIntervalCounter, Interval } from './types';

export const tileStyle: React.CSSProperties = {
    display: 'flex',
    fontSize: 24,
    fontFamily: 'Roboto',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
}

export const InitialCounter: Record<Interval, IIntervalCounter> = {
    "2m": {correct: 0, wrong: 0},
    "2M": {correct: 0, wrong: 0},
    "3M": {correct: 0, wrong: 0},
    "3m": {correct: 0, wrong: 0},
    "4P": {correct: 0, wrong: 0},
    "5P": {correct: 0, wrong: 0},
    "6M": {correct: 0, wrong: 0},
    "6m": {correct: 0, wrong: 0},
    "7M": {correct: 0, wrong: 0},
    "7m": {correct: 0, wrong: 0},
    "8P": {correct: 0, wrong: 0},
    "TT": {correct: 0, wrong: 0},
}
