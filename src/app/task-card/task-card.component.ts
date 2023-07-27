import { Component, Input } from '@angular/core';
import { TaskCard } from './task-card.model';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent {
  @Input({required: true}) taskCard!: TaskCard;

}
