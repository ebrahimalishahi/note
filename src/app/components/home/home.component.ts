import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { INote } from '../../models/note';
import { NoteService } from '../../services/note.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  note: INote[] = [];
  constructor(private noteService: NoteService, private activatedRoute: ActivatedRoute, private router: Router) { };
  ngOnInit(): void {
    this.note = this.noteService.getAll();
  };
  deletNote(noteId: number): void {
    if (confirm('do you want to delete?')) {
      this.noteService.delete(noteId);
      window.location.reload();
    } else {
      return;
    }
  }
 
}
