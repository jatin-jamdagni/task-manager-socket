import type { TaskColumnProps } from "../types";
import { getColumnColor } from "../utils/getColors";
import TaskCard from "./task-card";

export default function TaskColumn({
  column,
  tasks,
  provided,
  onEditTask,
}: TaskColumnProps) {
  return (
    <div className={`rounded-lg border shadow ${getColumnColor(column.id)}`}>
      <div className="flex flex-col space-y-1.5 p-6 pb-2">
        <h3 className="text-lg font-semibold   ">
          {column.title} ({tasks.length})
        </h3>
      </div>
      <div className="p-6 pt-0">
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="min-h-[150px]"
        >
          {tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              onEdit={() => onEditTask(task.id)}
            />
          ))}
          {provided.placeholder}
        </div>
      </div>
    </div>
  );
}
