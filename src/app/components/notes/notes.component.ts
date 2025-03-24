import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { INote } from '../../models/note';
import { NoteService } from '../../services/note.service';
import { SharedModule } from '../../shared/shared.module';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { FormControl, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, SharedModule, FormsModule],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css'
})
export class NotesComponent {
  note: INote[] = [];
  filteredNotes: INote[] = [];
  searchTerms: string = '';
  allTags: string[] = this.noteService.tags;
  tags: string[] = [];
  constructor(
    private noteService: NoteService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog) { };
  ngOnInit(): void {
    this.note = this.noteService.getAll();
    this.filteredNotes = this.note;
  };
  search(): void {
    if (this.searchTerms.trim() || this.tags.length) {
      this.filteredNotes = this.noteService.search(this.searchTerms.toLowerCase(), this.tags);
      return;
    }

    this.filteredNotes = this.note;
  }
  deletNote(note: INote): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: note,
    });

    dialogRef.afterClosed().pipe(filter(res => res)).subscribe(result => {
      this.noteService.delete(note.id);
      window.location.reload();
    });
  }
}

@Component({
  selector: 'confirm-dialog',
  template: `<h2 mat-dialog-title>Confirm Deletion</h2>
  <mat-dialog-content>
    <p>Are you sure you want to delete note
      <strong> {{data.title}} </strong>
      ?
    </p>
   
  </mat-dialog-content>
  <mat-dialog-actions>
    <button mat-button (click)="onNoClick()">No</button>
    <button mat-button [mat-dialog-close]="true" cdkFocusInitial>Yes</button>
  </mat-dialog-actions>`,
  standalone: true,
  imports: [
    SharedModule
  ],
})
export class ConfirmDialog {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: INote,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
