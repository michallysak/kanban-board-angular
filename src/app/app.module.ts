import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KanbanBoardComponent } from './kanban-board/kanban-board.component';
import { TaskCardComponent } from './task-card/task-card.component';
import { DropzoneComponent } from './dropzone/dropzone.component';
import { CreateTaskDialogComponent } from './create-task-dialog/create-task-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [AppComponent, KanbanBoardComponent, TaskCardComponent, DropzoneComponent, CreateTaskDialogComponent],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
