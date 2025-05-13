// types/columns.ts
import { Task } from './tasks';

export interface ColumnType {
  id: string;
  title: string;
  tasks: Task[];
}
