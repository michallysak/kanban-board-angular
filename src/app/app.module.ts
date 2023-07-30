import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KanbanBoardComponent } from './kanban-board/kanban-board.component';
import { TaskCardComponent } from './task-card/task-card.component';
import { DropzoneComponent } from './dropzone/dropzone.component';

@NgModule({
  declarations: [AppComponent, KanbanBoardComponent, TaskCardComponent, DropzoneComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
