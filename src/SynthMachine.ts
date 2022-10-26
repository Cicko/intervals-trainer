import * as Tone from 'tone';
import { getNoteString, getRandomItem } from './utils';
import { Alteration, Interval, Note } from './types';

export const intervalsSemitonesMap: Record<Interval, number> = {
    '2m': 1,
    '2M': 2,
    '3m': 3,
    '3M': 4,
    '4P': 5,
    'TT': 6,
    '5P': 7,
    '6m': 8,
    '6M': 9,
    '7m': 10,
    '7M': 11,
    '8P': 12,
};

export function getIntervalSemitones(interval): number {
    return intervalsSemitonesMap[interval];
}

export const Notes: Note[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
export const Alterations: Alteration[] = ['None', '#', 'b'];
export const Intervals: Interval[] = ['2m', '2M', '3m', '3M', '4P', 'TT', '5P', '6m', '6M', '7m', '7M', '8P']
export const NotesWithAlterations: string[] = [
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

interface IPlayRandomResponse {
    readonly first: string;
    readonly second: string;
    readonly interval: string;
}


export class SynthMachine {
    private readonly _synth: Tone.Synth;
    private result: IPlayRandomResponse;

    constructor() {
        this._synth = new Tone.Synth().toDestination();
        this.playRandomInterval.bind(this);
        this.replay.bind(this);
    }

    public get synth() {
        return this._synth;
    }

    public playRandomInterval(intervals: Interval[]): IPlayRandomResponse {
        const randomInterval = getRandomItem(intervals);
        let randomFirstNote = getNoteString(
            getRandomItem(Notes),
            getRandomItem(['None', '#'])
        );
        let secondNote = this
            .buildSecondNote(randomFirstNote, randomInterval);
        secondNote = secondNote.concat(
            NotesWithAlterations.indexOf(randomFirstNote) >=
            NotesWithAlterations.indexOf(secondNote) ?
                '5' : '4'
        );
        randomFirstNote = randomFirstNote.concat('4');
        this.playInterval(randomFirstNote, secondNote);

        this.result = {
            first: randomFirstNote,
            second: secondNote,
            interval: randomInterval,
        }
        return this.result;
    }

    private buildSecondNote(firstNote, interval): string {
        const intervalSemitones = getIntervalSemitones(interval);
        const firstNoteInx = NotesWithAlterations.indexOf(firstNote);
        const secondNoteInx = firstNoteInx + intervalSemitones;
        return NotesWithAlterations[secondNoteInx % NotesWithAlterations.length];
    }


    private playInterval(note1: string, note2: string) {
        const now = Tone.now()
        this.synth.triggerAttackRelease(note1, "8n", now)
        this.synth.triggerAttackRelease(note2, "8n", now + 0.5);
    }

    public replay() {
        if (this.result.first && this.result.second) {
            const now = Tone.now()
            this.synth.triggerAttackRelease(this.result.first, "8n", now)
            this.synth.triggerAttackRelease(this.result.second, "8n", now + 0.5);
        }
    }
}
