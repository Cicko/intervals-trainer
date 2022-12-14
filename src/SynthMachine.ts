import * as Tone from 'tone';
import { getRandomItem } from './utils';
import { Accumulator, Notes } from './types';

export const intervalsSemitonesMap: Record<Exclude<string, undefined>, number> = {
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

export function getIntervalSemitones(interval: string): number {
    if (!interval) {
        return 0;
    }
    return intervalsSemitonesMap[interval];
}

export const Intervals: string[] = Object.keys(intervalsSemitonesMap);

interface IPlayRandomResponse {
    readonly first: string;
    readonly second: string;
    readonly interval: string;
}


export class SynthMachine {
    private readonly _synth: Tone.Synth;
    private result: Accumulator<IPlayRandomResponse> = undefined;

    constructor() {
        this._synth = new Tone.Synth().toDestination();
    }

    public get synth() {
        return this._synth;
    }

    public playRandomInterval(intervals: string[]): IPlayRandomResponse {
        const randomInterval = getRandomItem(intervals);
        let randomFirstNote = getRandomItem(Notes);
        let secondNote = this
            .buildSecondNote(randomFirstNote, randomInterval);
        secondNote = secondNote.concat(
            Notes.indexOf(randomFirstNote) >=
            Notes.indexOf(secondNote) ?
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

    private buildSecondNote(firstNote: string, interval: string): string {
        const intervalSemitones = getIntervalSemitones(interval);
        const firstNoteInx = Notes.indexOf(firstNote);
        const secondNoteInx = firstNoteInx + intervalSemitones;
        return Notes[secondNoteInx % Notes.length];
    }


    private playInterval(note1: string, note2: string) {
        const now = Tone.now()
        this.synth.triggerAttackRelease(note1, "8n", now)
        this.synth.triggerAttackRelease(note2, "8n", now + 0.5);
    }

    public replay() {
        if (this.result?.first && this.result?.second) {
            const now = Tone.now()
            this.synth.triggerAttackRelease(this.result.first, "8n", now)
            this.synth.triggerAttackRelease(this.result.second, "8n", now + 0.5);
        }
    }
}
