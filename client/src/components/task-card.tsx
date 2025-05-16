import { Draggable } from "@hello-pangea/dnd";
import { Edit2 } from "lucide-react";
import { getPriorityColor } from "../utils/getColors";
import type { TaskCardProps } from "../types";

export default function TaskCard({ task, index, onEdit }: TaskCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-3"
        >
          <div
            className={`rounded-lg border border-gray-200 bg-[rgba(255,255,255,0.4)] duration-200  shadow ${
              snapshot.isDragging ? "shadow-lg" : ""
            }`}
          >
            <div className="p-3">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{task.title}</h3>
                <button
                  className=" bg-violet-400 p-1.5 rounded-md shadow-md active:shadow-xs shadow-red-100 cursor-pointer active:scale-90 duration-200"
                  onClick={onEdit}
                >
                  <Edit2 className="h-4 w-4" color="#fff" strokeWidth={3} />
                  <span className="sr-only">Edit</span>
                </button>
              </div>
              {task.description && (
                <p className="text-sm text-gray-700 mt-1  line-clamp-2">
                  {task.description}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                {task.priority && (
                  <span
                    className={` rounded-md px-2.5 py-0.5 text-xs font-semibold  ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                )}
                <div className=" flex items-center justify-center gap-x-1">
                  {task.tags?.map((tag) => (
                    <span
                      key={tag}
                      className=" rounded-md px-2.5 py-0.5 text-xs font-medium  "
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
