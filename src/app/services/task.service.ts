import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  exhaustMap,
  forkJoin,
  map,
  of,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import {
  DraggedTask,
  KanbanBoardColumn,
  KanbanBoardColumnTasks,
} from '../components/kanban-board/kanban-board.model';
import { MoveTask } from '../components/dropzone/dropzone.model';
import { TaskCard } from '../components/task-card/task-card.model';
import { CreateTask } from './task-service.model';
import { TaskDetailsDialogState } from '../components/task-details-dialog/task-details-dialog.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  kanbanBoardColumns$ = new BehaviorSubject<KanbanBoardColumnTasks[]>([]);

  showCreateTaskDialog$ = new BehaviorSubject<boolean>(false);
  taskDetailsDialogState$ = new BehaviorSubject<TaskDetailsDialogState>(
    undefined
  );

  kanbanBoardColumnsNamesAndIds$: Observable<KanbanBoardColumn[]> =
    this.kanbanBoardColumns$.pipe(
      map(kanbanBoardColumns =>
        kanbanBoardColumns.map(({ id, name }) => ({ id, name }))
      )
    );

  constructor(private httpClient: HttpClient) {}
  api = 'http://localhost:3001/api';

  loadBoardColumns() {
    this.httpClient
      .get<KanbanBoardColumn[]>(`${this.api}/table`, { observe: 'response' })
      .pipe(
        switchMap(response => {
          if (response.status !== 200 || !response.body) {
            console.error('');
            throw new Error('');
          }

          const kanbanBoardColumns = response.body;

          return forkJoin(
            kanbanBoardColumns.map(column =>
              this.loadTaskForColumn(column.id).pipe(
                map(tasks => ({ ...column, tasks }))
              )
            )
          );
        })
      )
      .subscribe(d => this.kanbanBoardColumns$.next(d));
  }

  loadTaskForColumn(columnId: string) {
    return this.httpClient
      .get<TaskCard[]>(`${this.api}/table/${columnId}/task`, {
        observe: 'response',
      })
      .pipe(
        map(response => {
          if (response.status !== 200 || !response.body) {
            throw new Error(
              `Error while get task for table with id ${columnId} Response: ${response.status} ${response.statusText}, body: ${response.body}`
            );
          }
          const tasks = response.body;

          return tasks;
        })
      );
  }

  editTask(editTask: {
    taskId: string;
    columnId: string;
    title: string;
    description: string;
  }) {
    this.kanbanBoardColumns$.pipe(take(1)).subscribe(kanbanBoardColumns => {
      let destinationColumnId: string | undefined = this.findTaskColumnId(
        kanbanBoardColumns,
        editTask
      );

      if (!destinationColumnId) {
        return;
      }

      if (editTask.columnId === destinationColumnId) {
        this.editTaskSameColumn(kanbanBoardColumns, editTask);
      } else {
        this.editTaskDifferentColum(
          kanbanBoardColumns,
          destinationColumnId,
          editTask
        );
      }
    });
  }

  private findTaskColumnId(
    kanbanBoardColumns: KanbanBoardColumnTasks[],
    editTask: {
      taskId: string;
      columnId: string;
      title: string;
      description: string;
    }
  ) {
    let destinationColumnId: string | undefined;
    for (const column of kanbanBoardColumns) {
      const ftask = column.tasks.find(
        taskCard => taskCard.id === editTask.taskId
      );
      destinationColumnId = ftask ? column.id : undefined;
      break;
    }
    return destinationColumnId;
  }

  private editTaskDifferentColum(
    kanbanBoardColumns: KanbanBoardColumnTasks[],
    findtaskcolumnId: string | undefined,
    editTask: {
      taskId: string;
      columnId: string;
      title: string;
      description: string;
    }
  ) {
    const edited = kanbanBoardColumns.map(column => {
      if (column.id === findtaskcolumnId) {
        return {
          id: column.id,
          name: column.name,
          tasks: column.tasks.filter(task => {
            task.id !== editTask.taskId;
          }),
        };
      }

      return column;
    });
    this.kanbanBoardColumns$.next(edited);
    this.createTask(editTask);
  }

  private editTaskSameColumn(
    kanbanBoardColumns: KanbanBoardColumnTasks[],
    editTask: {
      taskId: string;
      columnId: string;
      title: string;
      description: string;
    }
  ) {
    const edited = kanbanBoardColumns.map(column => {
      return {
        id: column.id,
        name: column.name,
        tasks: column.tasks.map(task => {
          if (task.id === editTask.taskId) {
            return {
              id: editTask.taskId,
              title: editTask.title,
              description: editTask.description,
            };
          }
          return task;
        }),
      };
    });
    this.kanbanBoardColumns$.next(edited);
  }

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
                id: createTask.taskId ?? this.generateUuid(),
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
    return crypto.randomUUID();
  }

  toggleCreateTaskDialogShow(state: TaskDetailsDialogState) {
    this.taskDetailsDialogState$.next(state);
    this.showCreateTaskDialog$.next(true);
  }

  getTask(taskId: string) {
    return this.kanbanBoardColumns$.pipe(
      map((columns: KanbanBoardColumnTasks[]) => {
        for (const column of columns) {
          const task = column.tasks.find(taskCard => taskCard.id === taskId);
          if (task) {
            return {
              ...task,
              columnId: column.id,
            };
          }
        }
        return undefined;
      })
    );
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
