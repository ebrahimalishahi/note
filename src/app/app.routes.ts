import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NoteComponent } from './components/note/note.component';

export const routes: Routes = [
    {path:'',component:HomeComponent},
    {path:'edit/:id',component:NoteComponent},
    {path:'create',component:NoteComponent},
];
