import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, take } from 'rxjs';
import {
  DraggedTask,
  KanbanBoardColumn,
  KanbanBoardColumnTasks,
} from '../components/kanban-board/kanban-board.model';
import { initialKanbanBoardColumn } from './task-service.data';
import { MoveTask } from '../components/dropzone/dropzone.model';
import { TaskCard } from '../components/task-card/task-card.model';
import { CreateTask } from './task-service.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  kanbanBoardColumns$ = new BehaviorSubject<KanbanBoardColumnTasks[]>(
    initialKanbanBoardColumn
  );

  showCreateTaskDialog$ = new BehaviorSubject<boolean>(false);
  createTaskDialogDefualtColumn$ = new BehaviorSubject<string | undefined>(
    undefined
  );

  kanbanBoardColumnsNamesAndIds$: Observable<KanbanBoardColumn[]> =
    this.kanbanBoardColumns$.pipe(
      map(kanbanBoardColumns =>
        kanbanBoardColumns.map(({ id, name }) => ({ id, name }))
      )
    );

  createTask(createTask: CreateTask) {
    this.kanbanBoardColumns$.pipe(take(1)).subscribe(kanbanBoardColumns => {
      const edited = kanbanBoardColumns.map(column => {
        if (column.id === createTask.columnId) {
          return {
            id: column.id,
            name: column.name,
            tasks: [
              ...column.tasks,
              {
                id: this.generateUuid(),
                title: createTask.title,
                description: createTask.description,
              },
            ],
          };
        }

        return column;
      });
      this.kanbanBoardColumns$.next(edited);
    });
  }

  private generateUuid() {
    return crypto.randomUUID()
  }

  toggleCreateTaskDialogShow(
    show: boolean,
    columnId: string | undefined = undefined
  ) {
    this.createTaskDialogDefualtColumn$.next(columnId);
    this.showCreateTaskDialog$.next(show);
  }

  moveTaskBetweenColumns(
    kanbanBoardColumns: KanbanBoardColumnTasks[],
    draggedTask: DraggedTask,
    moveTask: MoveTask
  ) {
    const kanbanBoardColumnSource = kanbanBoardColumns.find(
      column => column.id == draggedTask.columnId
    );
    const kanbanBoardColumnDestination = kanbanBoardColumns.find(
      column => column.id == moveTask.columnId
    );
    if (!kanbanBoardColumnSource || !kanbanBoardColumnDestination) {
      return;
    }

    const editedColumns = kanbanBoardColumns.map(column => {
      if (column.id === draggedTask.columnId) {
        return this.removeTaskFromSourceColumn(
          kanbanBoardColumnSource,
          draggedTask.taskId
        );
      }
      if (column.id === moveTask.columnId) {
        return this.computePositionIndestinationColumn(
          kanbanBoardColumnSource.tasks,
          kanbanBoardColumnDestination,
          draggedTask,
          moveTask
        );
      }
      return column;
    });

    this.kanbanBoardColumns$.next(editedColumns);
  }

  private removeTaskFromSourceColumn(
    kanbanBoardColumnSource: KanbanBoardColumnTasks,
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
    kanbanBoardColumnDestination: KanbanBoardColumnTasks,
    draggedTask: DraggedTask,
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
      taskCard => taskCard.id === draggedTask.taskId
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

  moveTaskInSingleColumn(
    kanbanBoardColumns: KanbanBoardColumnTasks[],
    draggedTask: DraggedTask,
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
        draggedTask,
        moveTask,
        draggedTaskColumn
      );
    });
    this.kanbanBoardColumns$.next(editedColumns);
  }

  private computeMoveTaskInSingleColumn(
    tasks: TaskCard[],
    draggedTask: DraggedTask,
    moveTask: MoveTask,
    draggedTaskColumn: KanbanBoardColumnTasks
  ): KanbanBoardColumnTasks {
    let newIndex =
      tasks.length === 0
        ? 0
        : moveTask.type === 'before'
        ? tasks.findIndex(taskCard => taskCard.id === moveTask.id) - 1
        : tasks.length - 1;

    const oldIndex = tasks.findIndex(
      taskCard => taskCard.id === draggedTask.taskId
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
