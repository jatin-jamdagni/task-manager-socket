export interface Task {
  id: string
  title: string
  description?: string
  columnId: string
  priority?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface Column {
  id: string
  title: string
  taskIds: string[]
}


export interface TaskColumnProps {
  column: Column;
  tasks: Task[];
  provided: any;
  onEditTask: (taskId: string) => void;
}


export interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: () => void;
}