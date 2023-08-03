export type MoveTask = { columnId: string } & (
  | { type: 'before'; id: string }
  | { type: 'end' }
);
