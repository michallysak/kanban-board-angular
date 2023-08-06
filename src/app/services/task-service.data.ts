import { KanbanBoardColumnTasks } from '../components/kanban-board/kanban-board.model';

export const initialKanbanBoardColumn: KanbanBoardColumnTasks[] = [
  {
    id: 'c27cda8b-81d3-458a-9a2e-0ad53e8e011e',
    name: 'TODO',
    tasks: [{ id: 'aaa', title: 'Aaa', description: 'Aaa' }],
  },
  {
    id: '777e0771-7601-4fb6-b78c-046db4cbdeba',
    name: 'In-progress',
    tasks: [],
  },
  {
    id: '142d6952-906e-4f4e-8443-8a220df94d7c',
    name: 'Done',
    tasks: [],
  },
];
