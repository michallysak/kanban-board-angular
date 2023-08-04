import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-details-dialog',
  templateUrl: './task-details-dialog.component.html',
  styleUrls: ['./task-details-dialog.component.scss'],
})
export class TaskDetailsDialogComponent implements OnInit {
  ngOnInit() {
    this.form.valueChanges.subscribe(x => console.log(x));
    this.createTaskDialogDefualtColumn$.subscribe(
      createTaskDialogDefualtColumn =>
        this.form.patchValue({ column: createTaskDialogDefualtColumn })
    );
  }

  @Input({ required: true }) show = false;

  kanbanBoardColumnsNamesAndIds$ =
    this.taskService.kanbanBoardColumnsNamesAndIds$;
  createTaskDialogDefualtColumn$ =
    this.taskService.createTaskDialogDefualtColumn$;

  constructor(
    public fb: FormBuilder,
    private taskService: TaskService,
    public dialogRef: MatDialogRef<TaskDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: object
  ) {}

  form = this.fb.group({
    title: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(10),
    ]),
    description: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(10),
    ]),
    column: ['', Validators.required],
  });

  onSubmit() {
    if (this.form.valid) {
      this.taskService.createTask({
        columnId: this.form.controls.column.value ?? '',
        title: this.form.controls.title.value,
        description: this.form.controls.description.value,
      });
      console.log(this.form.value);
      this.closeDialogAndClearForm();
    }
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
