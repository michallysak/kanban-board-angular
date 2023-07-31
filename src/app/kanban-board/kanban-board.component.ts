import { Component } from '@angular/core';
import { MoveTask } from '../dropzone/dropzone.model';
import { TaskCard } from '../task-card/task-card.model';
import { initialKanbanBoardColumn } from './kanban-board.data';
import { KanbanBoardColumn } from './kanban-board.model';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
})
export class KanbanBoardComponent {
  kanbanBoardColumns: KanbanBoardColumn[] = initialKanbanBoardColumn;

  private draggedTask: { columnId: string; taskId: string } | undefined;

  taskDragged(columnId: string, taskId: string) {
    this.draggedTask = { columnId, taskId };
  }

  taskDrop(moveTask: MoveTask) {
    moveTask.columnId !== this.draggedTask?.columnId
      ? this.moveTaskBetweenColumns(this.kanbanBoardColumns, moveTask)
      : this.moveTaskInSingleColumn(this.kanbanBoardColumns, moveTask);
  }

  private moveTaskBetweenColumns(
    kanbanBoardColumns: KanbanBoardColumn[],
    moveTask: MoveTask
  ) {
    const kanbanBoardColumnSource = kanbanBoardColumns.find(
      column => column.id == this.draggedTask?.columnId
    );
    const kanbanBoardColumnDestination = kanbanBoardColumns.find(
      column => column.id == moveTask.columnId
    );
    if (!kanbanBoardColumnSource || !kanbanBoardColumnDestination) {
      return;
    }

    const editedColumns = kanbanBoardColumns.map(column => {
      if (column.id === this.draggedTask?.columnId) {
        return this.removeTaskFromSourceColumn(
          kanbanBoardColumnSource,
          this.draggedTask?.taskId
        );
      }
      if (column.id === moveTask.columnId) {
        return this.computePositionIndestinationColumn(
          kanbanBoardColumnSource.tasks,
          kanbanBoardColumnDestination,
          moveTask
        );
      }
      return column;
    });

    this.kanbanBoardColumns = editedColumns;
    this.draggedTask = undefined;
  }

  private removeTaskFromSourceColumn(
    kanbanBoardColumnSource: KanbanBoardColumn,
    taskId: string
  ) {
    return {
      id: kanbanBoardColumnSource.id,
      name: kanbanBoardColumnSource.name,
      tasks: kanbanBoardColumnSource.tasks.filter(task => task.id !== taskId),
    };
  }

  private computePositionIndestinationColumn(
    kanbanBoardColumnSourceTasks: TaskCard[],
    kanbanBoardColumnDestination: KanbanBoardColumn,
    moveTask: MoveTask
  ) {
    const newTasks = [...kanbanBoardColumnDestination.tasks];

    const newIndex =
      newTasks.length === 0
        ? 0
        : moveTask.type === 'before'
        ? newTasks.findIndex(taskCard => taskCard.id === moveTask.id) - 1
        : newTasks.length - 1;

    const oldIndex = kanbanBoardColumnSourceTasks.findIndex(
      taskCard => taskCard.id === this.draggedTask?.taskId
    );

    const task = kanbanBoardColumnSourceTasks[oldIndex];
    let editedTasks: TaskCard[];
    if (newTasks.length === 0) {
      editedTasks = [task];
    } else {
      editedTasks = [...newTasks];
      editedTasks.splice(newIndex + 1, 0, task);
    }

    return {
      id: kanbanBoardColumnDestination.id,
      name: kanbanBoardColumnDestination.name,
      tasks: editedTasks,
    };
  }

  private moveTaskInSingleColumn(
    kanbanBoardColumns: KanbanBoardColumn[],
    moveTask: MoveTask
  ) {
    const draggedTaskColumn = kanbanBoardColumns.find(
      column => column.id === moveTask.columnId
    );
    if (!draggedTaskColumn) {
      return;
    }
    const tasks = [...draggedTaskColumn.tasks];

    const editedColumns = kanbanBoardColumns.map(column => {
      if (column.id !== draggedTaskColumn.id) {
        return column;
      }

      return this.computeMoveTaskInSingleColumn(
        tasks,
        moveTask,
        draggedTaskColumn
      );
    });
    this.kanbanBoardColumns = editedColumns;
    this.draggedTask = undefined;
  }

  private computeMoveTaskInSingleColumn(
    tasks: TaskCard[],
    moveTask: MoveTask,
    draggedTaskColumn: KanbanBoardColumn
  ): KanbanBoardColumn {
    let newIndex =
      tasks.length === 0
        ? 0
        : moveTask.type === 'before'
        ? tasks.findIndex(taskCard => taskCard.id === moveTask.id) - 1
        : tasks.length - 1;

    const oldIndex = tasks.findIndex(
      taskCard => taskCard.id === this.draggedTask?.taskId
    );

    if (oldIndex > newIndex) {
      newIndex++;
    }

    if (
      oldIndex < 0 ||
      oldIndex >= tasks.length ||
      newIndex < 0 ||
      newIndex >= tasks.length ||
      oldIndex === newIndex
    ) {
      return draggedTaskColumn;
    }

    const editedTasks = [...tasks];
    const [element] = editedTasks.splice(oldIndex, 1);
    editedTasks.splice(newIndex, 0, element);

    return {
      id: draggedTaskColumn.id,
      name: draggedTaskColumn.name,
      tasks: editedTasks,
    };
  }
}
