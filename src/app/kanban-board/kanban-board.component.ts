import { Component } from '@angular/core';
import { MoveTask } from '../dropzone/dropzone.model';
import { DraggedTask } from './kanban-board.model';
import { TaskService } from '../services/task.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
})
export class KanbanBoardComponent {
  kanbanBoardColumns$ = this.taskService.kanbanBoardColumns$;

  private draggedTask: DraggedTask | undefined;

  constructor(private taskService: TaskService) {}

  toggleCreateTaskDialogShow(show: boolean, columnId: string) {
    this.taskService.toggleCreateTaskDialogShow(show, columnId);
  }

  taskDragged(columnId: string, taskId: string) {
    this.draggedTask = { columnId, taskId };
  }

  taskDrop(moveTask: MoveTask) {
    this.kanbanBoardColumns$.pipe(take(1)).subscribe(kanbanBoardColumns => {
      if (!this.draggedTask) {
        return;
      }
      if (moveTask.columnId !== this.draggedTask.columnId) {
        this.taskService.moveTaskBetweenColumns(
          kanbanBoardColumns,
          this.draggedTask,
          moveTask
        );
      } else {
        this.taskService.moveTaskInSingleColumn(
          kanbanBoardColumns,
          this.draggedTask,
          moveTask
        );
      }

      this.draggedTask = undefined;
    });
  }
}
