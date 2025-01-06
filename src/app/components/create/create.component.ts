import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { INote } from '../../models/note';
import { NoteService } from '../../services/note.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  newNote: INote = {
    id: 0,
    title: '',
    description: '',
    date: new Date(),
    color: '',
  }
  componentCreate: boolean = false;
  constructor(private noteSerice: NoteService, private activatedRoute: ActivatedRoute, private router: Router) { }
  createNew(): void {
    console.log(this.newNote);
    this.noteSerice.create(this.newNote);
    console.log(this.newNote);
    alert('create new note successfull !');
    this.newNote = {
      id: 0,
      title: '',
      description: '',
      date: new Date(),
      color: '',
    }
  }
  goBack(){
    this.router.navigate([''])
  }
}
