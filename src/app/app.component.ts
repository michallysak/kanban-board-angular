import { Component } from '@angular/core';
import { TaskService } from './services/task.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  showCreateTaskDialog$ = this.taskService.showCreateTaskDialog$;

  constructor(private taskService: TaskService) {}

  exitCreateTaskDialogShow() {
    this.taskService.toggleCreateTaskDialogShow(false);
  }
}
