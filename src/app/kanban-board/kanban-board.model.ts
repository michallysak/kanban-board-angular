import { TaskCard } from '../task-card/task-card.model';

export interface KanbanBoardColumn {
  id: string;
  name: string;
  tasks: TaskCard[];
}
