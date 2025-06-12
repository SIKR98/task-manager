import { Task } from './task.model';

export interface Project {
  id: number;
  name: string;
  description?: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  created_at?: string;
}

