
import {Alteration, Interval, Note, Notes} from './types';
import {Intervals, intervalsSemitonesMap} from "./SynthMachine";

export function getRandomItem(array: Array<any>) {
    return array[Math.floor(Math.random() * array.length)];
}

export function getNoteString(note: Note, alteration: Alteration ): string {
    const nonAlterableNotes = ['E', 'B']
    const alterationString: string =
        alteration != 'None' && !nonAlterableNotes.includes(note) ? alteration : '';
    return note.concat(alterationString)
}

export function getNoteFromPitch(frequency: number) {
    const noteNum = 12 * (Math.log(frequency / 440)/Math.log(2));
    return Notes[(Math.round(noteNum) + 69) % 12];
}


export function getIntervalFromTwoNotes(note1: string, note2: string): Interval {
    const firstNoteInx = Notes.indexOf(note1);
    const secondNoteInx = Notes.indexOf(note2);
    const semitones = secondNoteInx - firstNoteInx > 0 ? secondNoteInx - firstNoteInx : 12 + secondNoteInx - firstNoteInx;
    console.log("SEMITONES: " + semitones);
    console.log('===================================');

    return Intervals[semitones - 1];
}

export function autoCorrelate(buf: Float32Array, sampleRate: number) {
    // Implements the ACF2+ algorithm
    var SIZE = buf.length;
    var rms = 0;

    for (let i = 0; i < SIZE; i++) {
        rms += buf[i] * buf[i];
    }
    rms = Math.sqrt(rms/SIZE); // una especie de media

    if (rms < 0.01) // not enough signal
        return -1;

    let r1 = 0,
        r2 = SIZE - 1,
        thres = 0.2;

    for (let i = 0; i < SIZE / 2; i++)
        if (Math.abs(buf[i]) < thres) { r1=i; break; }
    for (let i = 1;  i < SIZE / 2; i++)
        if (Math.abs(buf[SIZE - i]) < thres) { r2 = SIZE - i; break; }

    buf = buf.slice(r1,r2);
    SIZE = buf.length;

    let c = new Array(SIZE).fill(0);
    for (var i = 0; i < SIZE; i++)
        for (var j = 0; j < SIZE - i; j++)
            c[i] = c[i] + buf[j]*buf[j+i];

    var d=0; while (c[d]>c[d+1]) d++;
    var maxval=-1, maxpos=-1;
    for (var i=d; i<SIZE; i++) {
        if (c[i] > maxval) {
            maxval = c[i];
            maxpos = i;
        }
    }
    var T0 = maxpos;

    var x1=c[T0-1], x2=c[T0], x3=c[T0+1];
    let a = (x1 + x3 - 2*x2)/2;
    let b = (x3 - x1)/2;
    if (a) T0 = T0 - b/(2*a);

    return sampleRate/T0;
}
