import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

import { NoteService } from '../../services/note.service';
import { INote } from '../../models/note';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss'
})
export class NoteComponent {
  noteId: number | any;
  note!: INote;
  constructor(private noteSerice: NoteService, private activatedRoute: ActivatedRoute, private router: Router) { }
  ngOnInit(): void {
    this.initNote();
    this.activatedRoute.params.subscribe(params => {
      this.noteId = params['id'];

      if (this.noteId) {
        this.note = this.noteSerice.get(this.noteId);
      }
    })
  }

  submit(): void {
    if (this.noteId) {
      this.update();
    } else {
      this.create();
    }
  }

  update(): void {
    this.noteSerice.update(this.note);
    alert('record has been updated!')
    this.goback();
  }

  create(): void {
    this.noteSerice.create(this.note);
    alert('create new note successfull !');
    this.initNote();
  }

  initNote(): void {
    this.note = {
      id: this.noteSerice.genetateId(),
      title: '',
      description: '',
      date: new Date(),
      color: '#000000',
    }
  }
  goback(): void {
    this.router.navigate(['']);
  }
}
