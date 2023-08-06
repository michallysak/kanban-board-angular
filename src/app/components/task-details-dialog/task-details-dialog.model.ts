

export type TaskDetailsDialogState =
  | { type: 'existing'; taskId: string }
  | { type: 'new'; columnId: string }
  | undefined;

export type TaskDetailsMode = 'create' | 'view' | 'edit';
