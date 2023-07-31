import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'KanbanBoardAngular';
  showCreateTaskDialog = true;

  toggleCreateTaskDialogShow(show: boolean) {
    this.showCreateTaskDialog = show;
  }
}
