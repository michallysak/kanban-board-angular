import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrls: ['./dropzone.component.scss'],
})
export class DropzoneComponent {
  @Input() fullHeight = false;

  @Output() itemDrop = new EventEmitter<void>();

  dragover = false;

  drop(event: DragEvent) {
    event.preventDefault();
    this.dragover = false;
    this.itemDrop.emit();
  }

  dragEnter() {
    this.dragover = true;
  }

  dragOver(event: DragEvent) {
    event.preventDefault();
  }

  dragLeave() {
    this.dragover = false;
  }
}
