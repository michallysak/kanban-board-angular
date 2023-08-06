import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TaskService } from '../../services/task.service';
import { TaskDetailsMode } from './task-details-dialog.model';

@Component({
  selector: 'app-task-details-dialog',
  templateUrl: './task-details-dialog.component.html',
  styleUrls: ['./task-details-dialog.component.scss'],
})
export class TaskDetailsDialogComponent implements OnInit {
  mode: TaskDetailsMode = 'view';
  currentTask = { taskId: '', columnId: '' };

  @Input({ required: true }) show = false;

  kanbanBoardColumnsNamesAndIds$ =
    this.taskService.kanbanBoardColumnsNamesAndIds$;
  createTaskDialogDefualtColumn$ = this.taskService.taskDetailsDialogState$;

  form = this.fb.group({
    title: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(10),
    ]),
    description: this.fb.nonNullable.control('', [Validators.maxLength(10)]),
    column: ['', Validators.required],
  });

  constructor(
    public fb: FormBuilder,
    private taskService: TaskService,
    public dialogRef: MatDialogRef<TaskDetailsDialogComponent>,
  ) {}

  ngOnInit() {
    this.createTaskDialogDefualtColumn$.subscribe(
      createTaskDialogDefualtColumn => {
        if (!createTaskDialogDefualtColumn) {
          this.form.reset();
          return;
        }
        if (createTaskDialogDefualtColumn.type === 'new') {
          this.mode = 'create';
          this.form.patchValue({
            column: createTaskDialogDefualtColumn.columnId,
          });

          this.currentTask = {
            taskId: '',
            columnId: createTaskDialogDefualtColumn.columnId,
          };
        }
        if (createTaskDialogDefualtColumn.type === 'existing') {
          this.updateFormWithTask(createTaskDialogDefualtColumn.taskId);
        }
      }
    );
  }

  updateFormWithTask(taskId: string) {
    this.taskService.getTask(taskId).subscribe(task => {
      if (!task) {
        return;
      }
      this.mode = 'view';
      const { id: taskId, title, columnId: column, description } = task;
      this.form.patchValue({ title, column, description });
      this.currentTask = { taskId, columnId: task.columnId };
    });
  }

  setEditMode() {
    this.mode = 'edit';
  }

  onSubmit() {
    if (this.form.valid) {
      switch (this.mode) {
        case 'create':
          this.taskService.createTask({
            columnId: this.form.controls.column.value ?? '',
            title: this.form.controls.title.value,
            description: this.form.controls.description.value,
          });
          this.closeDialogAndClearForm();
          break;
        case 'edit':
          this.taskService.editTask({
            taskId: this.currentTask.taskId,
            columnId: this.form.controls.column.value ?? '',
            title: this.form.controls.title.value,
            description: this.form.controls.description.value,
          });
          this.mode = 'view';
          break;
        case 'view':
          break;
      }
    }
  }

  cancelEdit() {
    this.mode = 'view';
    this.updateFormWithTask(this.currentTask.taskId);
  }

  clickClose() {
    this.closeDialogAndClearForm();
  }

  clickOutside() {
    this.closeDialogAndClearForm();
  }

  closeDialogAndClearForm() {
    this.form.reset();
    this.dialogRef.close();
  }

  clickInside(event: Event) {
    event.stopPropagation();
  }

  handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closeDialogAndClearForm();
    }
  }
}
