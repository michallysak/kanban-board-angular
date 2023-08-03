import { TaskCard } from '../task-card/task-card.model';

export type KanbanBoardColumnTasks = KanbanBoardColumn & { tasks: TaskCard[] };

export interface KanbanBoardColumn {
  id: string;
  name: string;
}

export interface DraggedTask {
  columnId: string;
  taskId: string;
}
