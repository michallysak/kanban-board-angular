import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';

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
export class CreateTaskDialogComponent {
  @Input({ required: true }) show = false;
  @Output() exit = new EventEmitter<void>()

  clickClose() {
    this.exit.emit()
  }

  clickOutside() {
    this.exit.emit()
  }

  clickInside(event: Event) {
    event.stopPropagation();
  }

}
