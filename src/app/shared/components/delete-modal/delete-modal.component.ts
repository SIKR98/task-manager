import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-modal.component.html',
})
export class DeleteModalComponent {
  @Input() title: string = 'Bekräfta borttagning';
  @Input() message: string = 'Är du säker på att du vill ta bort detta?';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
