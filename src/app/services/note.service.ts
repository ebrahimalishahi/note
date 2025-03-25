import { Injectable } from '@angular/core';
import { INote } from '../models/note';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  tags = [
    'Work',
    'Goals',
    'Fitness',
    'Personal',
    'Ideas',
    'Shopping',
    'Travel',
    'Study'
  ]

  groups = [
    { title: 'Financial', icon: 'attach_money' },
    { title: 'Academic', icon: 'school' },
    { title: 'Personal', icon: 'person' },
    { title: 'Health', icon: 'healing' },
    { title: 'Travel', icon: 'airplanemode_active' },
    { title: 'Hobbies', icon: 'music_note' },
    { title: 'Groceries', icon: 'local_grocery_store' }
  ]
  private localStorageKey = 'note_notes'
  constructor() { }
  getAll(): INote[] {
    const notesJson = localStorage.getItem(this.localStorageKey);
    return notesJson ? JSON.parse(notesJson) : [];
  }
  get(id: number): INote | any {
    const notesJson = localStorage.getItem(this.localStorageKey);
    const notes: INote[] = notesJson ? JSON.parse(notesJson) : [];
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
  genetateId(): number {
    const notes: INote[] = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
    const ids = notes.map(note => note.id);
    const maxId = Math.max(...ids);
    return maxId >= 0 ? maxId + 1 : 1;
  }
  search(searchTerms: string, group: string, tags: string[]): INote[] {
    const notes: INote[] = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
    return notes.filter(note =>
      (note.title.toLowerCase().includes(searchTerms) ||
        (note.description && note.description.toLowerCase().includes(searchTerms))) &&
      (note.group && note.group.title == group) &&
      (tags.length === 0 || (note.tags && tags.every(tag => note.tags.includes(tag))))
    );
  }
}
