import { Component } from '@angular/core';
import { KanbanBoardColumn } from './kanban-board.model';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
})
export class KanbanBoardComponent {
  kanbanBoardColumns: KanbanBoardColumn[] = [
    {
      id: 'c27cda8b-81d3-458a-9a2e-0ad53e8e011e',
      name: 'TODO',
      tasks: [
        {
          id: 'deba1012-88f2-494f-9ed3-a9fc00718cc1',
          title: 'Todo task',
          description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi incidunt, dolores possimus, optio, ducimus officiis a placeat ratione molestiae dolore expedita quisquam aliquid facere. Voluptatem, assumenda. Laboriosam tempora accusamus soluta.',
        },
      ],
    },
    {
      id: '777e0771-7601-4fb6-b78c-046db4cbdeba',
      name: 'In-progress',
      tasks: [
        {
          id: '45e25fc0-53fc-4040-b0d7-7a395bcfea00',
          title: 'In-progress task',
          description:
            'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Error possimus iure voluptate tenetur, quaerat deleniti autem quisquam, reprehenderit incidunt quibusdam ex? Rerum, vel quibusdam nesciunt iste doloribus amet quod aperiam!',
        },
      ],
    },
    {
      id: '142d6952-906e-4f4e-8443-8a220df94d7c',
      name: 'Done',
      tasks: [
        {
          id: 'fa00adb6-f80a-4afa-b4da-f025e673f421',
          title: 'Done task',
          description:
            'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Omnis et minima ad perspiciatis harum, quisquam neque quibusdam asperiores ipsam, voluptatum expedita rerum consectetur laborum animi tempora, officia amet aliquam dolorem.',
        },
      ],
    },
  ];
}
