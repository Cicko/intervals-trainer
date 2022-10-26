import { Alteration, Note } from './App';

export function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function getNoteString(note: Note, alteration: Alteration ): string {
    const nonAlterableNotes = ['E', 'B']
    const alterationString: string =
        alteration != 'None' && !nonAlterableNotes.includes(note) ? alteration : '';
    return note.concat(alterationString)
}
