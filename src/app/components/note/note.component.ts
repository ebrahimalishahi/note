import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

import { NoteService } from '../../services/note.service';
import { INote } from '../../models/note';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SharedModule, ReactiveFormsModule],
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss'
})
export class NoteComponent {
  form!: FormGroup;
  noteId: number | any;
  // note!: INote;
  titleMaxLength = 256;
  descriptionMaxLength = 400;
  constructor(
    private noteSerice: NoteService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router) {
    this.form = formBuilder.group({
      id: this.formBuilder.control(this.noteSerice.genetateId(), { nonNullable: true }),
      date:this.formBuilder.control( new Date(), { nonNullable: true }),
      title: [null, Validators.required],
      description: [null],
      color:this.formBuilder.control('#000000', { nonNullable: true })
    })
  }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.noteId = params['id'];

      if (this.noteId) {
        this.form.patchValue(this.noteSerice.get(this.noteId));
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
    this.noteSerice.update(this.form.value);
    alert('record has been updated!')
    this.goback();
  }

  create(): void {
    this.noteSerice.create(this.form.value);
    alert('create new note successfull !');
    this.form.reset();
  }

  goback(): void {
    this.router.navigate(['']);
  }
}
