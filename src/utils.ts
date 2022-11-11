
import {Alteration, Interval, IStatisticsCounter, Note} from './types';
import { Intervals } from './SynthMachine';

export function getRandomItem(array: Array<any>) {
    return array[Math.floor(Math.random() * array.length)];
}

export function getNoteString(note: Note, alteration: Alteration ): string {
    const nonAlterableNotes = ['E', 'B']
    const alterationString: string =
        alteration != 'None' && !nonAlterableNotes.includes(note) ? alteration : '';
    return note.concat(alterationString)
}

export function getMostWrongIntervals(counter: IStatisticsCounter, len: number, minWrong?: number): Interval[] {
    const intervalsSortedByWrongNum = [...Intervals].sort((val, val2) => {
        const wrong1 = counter[val].wrong;
        const wrong2 = counter[val2].wrong;

        return wrong2 - wrong1;
    });
    return intervalsSortedByWrongNum
        .filter(v => counter[v].wrong >= (minWrong || 0))
        .filter((v, i) => i<len)
}

export function getMostCorrectIntervals(counter: IStatisticsCounter, len: number, minCorrect?: number): Interval[] {
    const intervalsSortedByCorrectNum = [...Intervals].sort((val, val2) => {
        const correct1 = counter[val].correct;
        const correct2 = counter[val2].correct;

        return correct2 - correct1;
    });

    return intervalsSortedByCorrectNum
        .filter(v => counter[v].correct > (minCorrect || 0))
        .filter((v, i) => i<len)
}
