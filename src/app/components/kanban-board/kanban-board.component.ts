import { Component, OnInit } from '@angular/core';
import { MoveTask } from '../dropzone/dropzone.model';
import { DraggedTask } from './kanban-board.model';
import { TaskService } from '../../services/task.service';
import { take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TaskDetailsDialogComponent } from '../task-details-dialog/task-details-dialog.component';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
})
export class KanbanBoardComponent implements OnInit {
  kanbanBoardColumns$ = this.taskService.kanbanBoardColumns$;

  private draggedTask: DraggedTask | undefined;
  private showCreateTaskDialog$ = this.taskService.showCreateTaskDialog$;

  constructor(
    private taskService: TaskService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.showCreateTaskDialog$.subscribe(showCreateTaskDialog => {
      if (showCreateTaskDialog) {
        this.dialog.open(TaskDetailsDialogComponent, { data: {} });
      }
    });
  }

  addTaskClick(columnId: string) {
    this.taskService.toggleCreateTaskDialogShow({type: 'new', columnId})
  }

  taskClick(taskId: string) {
    this.taskService.toggleCreateTaskDialogShow({type: 'existing', taskId})
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
