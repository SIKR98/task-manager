export type TaskStatus = 'pending' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: number;
  projectId: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string; // ISO-format
}
