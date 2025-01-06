import { Injectable } from '@angular/core';
import { INote } from '../models/note';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private localStorageKey = 'notes_with_testycodes'
  constructor() { }
  getAll(): INote[] {
    const notesJson = localStorage.getItem(this.localStorageKey);
    return notesJson ? JSON.parse(notesJson) : [];
  }
  get(id: number): INote | any {
    const notesJson = localStorage.getItem(this.localStorageKey);
    const notes: INote[] = notesJson ? JSON.parse(notesJson) : [];
    console.log(id);
    console.log(notes);
    console.log(notes.find((n) => n.id == id));
    return notes.find((n) => n.id == id);
  }
  create(note: INote): INote {
    let notes: INote[] = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
    note.id = this.genetateId();
    notes.push(note);
    localStorage.setItem(this.localStorageKey, JSON.stringify(notes));
    return note;
  }
  update(note: INote): INote | undefined {
    let notes: INote[] = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
    const index = notes.findIndex(n => n.id == note.id);
    if (index !== -1) {
      console.log('testcodes');
      notes[index] = note;
      localStorage.setItem(this.localStorageKey, JSON.stringify(notes));
      return note;
    }
    return undefined
  }
  delete(id: number): void {
    let notes: INote[] = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
    const index = notes.findIndex(n => n.id === id);
    if (index !== -1) {
      notes.splice(index, 1);
      localStorage.setItem(this.localStorageKey, JSON.stringify(notes));
    }
  }
  private genetateId(): number {
    const notes: INote[] = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
    const ids = notes.map(note => note.id);
    const maxId = Math.max(...ids);
    return maxId >= 0 ? maxId + 1 : 0
  }
}
