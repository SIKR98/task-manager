import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deadlineStatus',
  standalone: true,
})
export class DeadlineStatusPipe implements PipeTransform {
  transform(value: string | Date): string {
    const today = new Date();
    const deadline = new Date(value);

    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);

    if (deadline.getTime() === today.getTime()) {
      return 'Idag';
    }

    if (deadline > today) {
      return 'Kommande';
    }

    return 'Passerad';
  }
}
