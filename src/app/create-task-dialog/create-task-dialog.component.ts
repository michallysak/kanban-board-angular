import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-create-task-dialog',
  templateUrl: './create-task-dialog.component.html',
  styleUrls: ['./create-task-dialog.component.scss'],
  animations: [
    trigger('fade', [
      state('false', style({ opacity: 0, visible: 'hidden', display: 'none' })),
      state('true', style({ opacity: 1, visible: 'visible' })),
      transition('false => true', [animate(250)]),
      transition('true => false', [animate(250)]),
    ]),
  ],
})
export class CreateTaskDialogComponent implements OnInit {
  @Input({ required: true }) show = false;
  @Output() exit = new EventEmitter<void>();

  kanbanBoardColumnsNamesAndIds$ =
    this.taskService.kanbanBoardColumnsNamesAndIds$;
  createTaskDialogDefualtColumn$ =
    this.taskService.createTaskDialogDefualtColumn$;

  constructor(
    public fb: FormBuilder,
    private taskService: TaskService
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

  ngOnInit() {
    this.form.valueChanges.subscribe(x => console.log(x));
    this.createTaskDialogDefualtColumn$.subscribe(
      createTaskDialogDefualtColumn =>
        this.form.patchValue({ column: createTaskDialogDefualtColumn })
    );
  }

  onSubmit() {
    if (this.form.valid) {
      this.taskService.createTask({
        columnId: this.form.controls.column.value ?? '',
        title: this.form.controls.title.value,
        description: this.form.controls.description.value,
      })
      console.log(this.form.value);
      this.exitAndClearForm();
    }
  }

  clickClose() {
    this.exitAndClearForm();
  }

  clickOutside() {
    this.exitAndClearForm();
  }

  exitAndClearForm() {
    this.exit.emit();
    this.form.reset();
  }

  clickInside(event: Event) {
    event.stopPropagation();
  }

  handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.exitAndClearForm();
    }
  }
}
