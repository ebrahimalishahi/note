import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { INote } from '../../models/note';
import { NoteService } from '../../services/note.service';
import { SharedModule } from '../../shared/shared.module';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { filter } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, SharedModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  note: INote[] = [];
  constructor(
    private noteService: NoteService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog) { };
  ngOnInit(): void {
    this.note = this.noteService.getAll();
  };
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