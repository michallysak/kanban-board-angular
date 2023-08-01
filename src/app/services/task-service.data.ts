import { KanbanBoardColumnTasks } from "../kanban-board/kanban-board.model";

export const initialKanbanBoardColumn: KanbanBoardColumnTasks[] = [
  {
    id: 'c27cda8b-81d3-458a-9a2e-0ad53e8e011e',
    name: 'TODO',
    tasks: ['A', 'B', 'C', 'D', 'E'].map(x => ({
      id: x,
      title: x,
      description: x,
    })),
  },
  {
    id: '777e0771-7601-4fb6-b78c-046db4cbdeba',
    name: 'In-progress',
    tasks: ['1', '2', '3', '4', '5'].map(x => ({
      id: x,
      title: x,
      description: x,
    })),
  },
  {
    id: '142d6952-906e-4f4e-8443-8a220df94d7c',
    name: 'Done',
    tasks: ['*', '**', '***', '****', '*****'].map(x => ({
      id: x,
      title: x,
      description: x,
    })),
  },
]
