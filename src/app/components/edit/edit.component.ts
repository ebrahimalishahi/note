import { Component, OnInit } from '@angular/core';
import { NoteService } from '../../services/note.service';
import { INote } from '../../models/note';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent{
  noteId: number | any;
  note: INote | any;
  constructor(private noteSerice: NoteService, private activatedRoute: ActivatedRoute, private router: Router) { }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.noteId = params['id'];
      console.log(this.noteId);
      if (this.noteId >= 0) {
        this.note = this.noteSerice.get(this.noteId);
        console.log(this.note);
      } else {
        console.log('something wrong');
      }
    })
  }

  update() {
    this.noteSerice.update(this.note);
    this.router.navigate(['']);
    alert('record has been updated!')
  }
  goback() {
    this.router.navigate(['']);
  }
}
