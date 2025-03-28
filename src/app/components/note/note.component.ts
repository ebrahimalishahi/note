import { Component, ElementRef, inject, model, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { map, Observable, startWith } from 'rxjs';
import { ColorPickerModule } from 'ngx-color-picker';

import { NoteService } from '../../services/note.service';
import { SharedModule } from '../../shared/shared.module';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { INote } from '../../models/note';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SharedModule, ReactiveFormsModule, ColorPickerModule],
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss'
})
export class NoteComponent {
  get color() {
    return this.form.get('color');
  }
  groups = this.noteService.groups;
  isPickerOpen: boolean = false;
  form!: FormGroup;
  noteId: number | any;
  titleMaxLength = 256;
  descriptionMaxLength = 400;
  presetColors: string[] = ['#1F2937', '#2E2E2E', '#374151', '#4A4A4A', '#6B7280', '#3B0764', '#4C1D95', '#6D28D9', '#5B21B6', '#4338CA', '#1E3A8A', '#1D4ED8', '#2563EB', '#0D9488', '#047857', '#065F46', '#15803D', '#166534', '#4B5E40', '#854D0E', '#7C2D12', '#B45309', '#B91C1C', '#BE123C']; readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  allTags: string[] = this.noteService.tags;
  readonly currentFruit = model('');
  readonly announcer = inject(LiveAnnouncer);
  tagCtrl = new FormControl('');
  filteredTags!: Observable<string[]>;
  get tags(): FormArray {
    return this.form.get('tags') as FormArray;
  }


  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;

  constructor(
    private noteService: NoteService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private router: Router) { }

  ngOnInit(): void {
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => (tag ? this._filter(tag) : this.allTags.slice())),
    );

    this.createForm();
    this.activatedRoute.params.subscribe(params => {
      this.noteId = params['id'];

      if (this.noteId) {
        const notes: INote = this.noteService.get(this.noteId);
        this.form.patchValue(notes);

        notes.tags.forEach(val => {
          this.addTag(val);
        })
      }
    })
  }

  onColorChange(color: string) {
    this.form.patchValue({ color });
    this.isPickerOpen = false;
  }
  addTag(tag: string): void {
    this.tags.push(this.formBuilder.control(tag));
  }

  removeTag(index: number): void {
    this.tags.removeAt(index);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.noteId) {
      this.update();
    } else {
      this.create();
    }
  }

  update(): void {
    this.noteService.update(this.form.value);
    this.snackbarService.showMessage('Note has been updated!');

    this.goback();
  }

  create(): void {
    this.noteService.create(this.form.value);
    this.snackbarService.showMessage('Create new note successfull!');
    this.form.reset();
  }

  goback(): void {
    this.router.navigate(['']);
  }
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value && this.allTags.find(tag => tag == value)) {
      this.tags.push(value);
    }

    event.chipInput!.clear();

    this.tagCtrl.setValue(null);
  }
  remove(tag: string): void {
    const index = this.tags.value.indexOf(tag);

    if (index >= 0) {
      this.removeTag(index);
      this.announcer.announce(`Removed ${tag}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.addTag(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter(tag => tag.toLowerCase().includes(filterValue));
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      id: this.formBuilder.control(this.noteService.genetateId(), { nonNullable: true }),
      date: this.formBuilder.control(new Date(), { nonNullable: true }),
      title: [null, Validators.required],
      description: [null],
      group: [null],
      color: this.formBuilder.control('#3f51b5', { nonNullable: true }),
      tags: this.formBuilder.array([])
    })
  }
}
