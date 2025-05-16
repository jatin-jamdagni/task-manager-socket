import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { io } from "socket.io-client";
import { Plus } from "lucide-react";
import TaskColumn from "./task-column";
import TaskDialog from "./task-dialog";
import type { Column, Task } from "../types";
import { initialColumns } from "../utils/constant";
import { getBoard } from "../utils/api";

const initialTasks: Record<string, Task> = {};

export default function TaskBoard() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [tasks, setTasks] = useState<Record<string, Task>>(initialTasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketServer = import.meta.env.BACKEND_URL || "http://localhost:3001";
    const socketInstance = io(socketServer);

    socketInstance.on("connect", () => {
      console.log("Connected to socket server");
      setIsConnected(true);
    });

    socketInstance.on("board-update", (data) => {
      setTasks(data.tasks);
      setColumns(data.columns);
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from socket server");
      setIsConnected(false);
    });

    setSocket(socketInstance);

    getBoard().then((res) => {
      setTasks(res?.tasks);
      setColumns(res?.columns);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumn = columns.find((col) => col.id === source.droppableId);
    const destColumn = columns.find(
      (col) => col.id === destination.droppableId
    );

    if (!sourceColumn || !destColumn) return;

    const newColumns = [...columns];
    const sourceColumnIndex = columns.findIndex(
      (col) => col.id === source.droppableId
    );
    const destColumnIndex = columns.findIndex(
      (col) => col.id === destination.droppableId
    );

    if (source.droppableId === destination.droppableId) {
      const newTaskIds = Array.from(sourceColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...sourceColumn,
        taskIds: newTaskIds,
      };

      newColumns[sourceColumnIndex] = newColumn;
    } else {
      const sourceTaskIds = Array.from(sourceColumn.taskIds);
      sourceTaskIds.splice(source.index, 1);

      const destTaskIds = Array.from(destColumn.taskIds);
      destTaskIds.splice(destination.index, 0, draggableId);

      newColumns[sourceColumnIndex] = {
        ...sourceColumn,
        taskIds: sourceTaskIds,
      };

      newColumns[destColumnIndex] = {
        ...destColumn,
        taskIds: destTaskIds,
      };
    }

    setColumns(newColumns);

    if (socket && isConnected) {
      socket.emit("update-board", {
        tasks,
        columns: newColumns,
      });
    }
  };

  const handleAddTask = (task: Task) => {
    const newTasks = { ...tasks, [task.id]: task };

    const newColumns = columns.map((column) => {
      if (column.id === task.columnId) {
        return {
          ...column,
          taskIds: [...column.taskIds, task.id],
        };
      }
      return column;
    });

    setTasks(newTasks);
    setColumns(newColumns);
    setIsDialogOpen(false);
    setEditingTask(null);

    if (socket && isConnected) {
      socket.emit("update-board", {
        tasks: newTasks,
        columns: newColumns,
      });
    }
  };

  const handleEditTask = (taskId: string) => {
    const task = tasks[taskId];
    if (task) {
      setEditingTask(task);
      setIsDialogOpen(true);
    }
  };

  const handleUpdateTask = (updatedTask: Task) => {
    const newTasks = { ...tasks, [updatedTask.id]: updatedTask };

    let newColumns = [...columns];
    const oldTask = tasks[updatedTask.id];

    if (oldTask.columnId !== updatedTask.columnId) {
      newColumns = columns.map((column) => {
        if (column.id === oldTask.columnId) {
          return {
            ...column,
            taskIds: column.taskIds.filter((id) => id !== updatedTask.id),
          };
        }
        if (column.id === updatedTask.columnId) {
          return {
            ...column,
            taskIds: [...column.taskIds, updatedTask.id],
          };
        }
        return column;
      });
    }

    setTasks(newTasks);
    setColumns(newColumns);
    setIsDialogOpen(false);
    setEditingTask(null);

    // Send update to server
    if (socket && isConnected) {
      socket.emit("update-board", {
        tasks: newTasks,
        columns: newColumns,
      });
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const newTasks = { ...tasks };
    const task = newTasks[taskId];
    delete newTasks[taskId];

    const newColumns = columns.map((column) => {
      if (column.id === task.columnId) {
        return {
          ...column,
          taskIds: column.taskIds.filter((id) => id !== taskId),
        };
      }
      return column;
    });

    setTasks(newTasks);
    setColumns(newColumns);
    setIsDialogOpen(false);
    setEditingTask(null);

    if (socket && isConnected) {
      socket.emit("update-board", {
        tasks: newTasks,
        columns: newColumns,
      });
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className=" flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold">Real Time Task</h2>
        <button
          className=" flex items-center border rounded-md py-1.5 px-3 bg-indigo-500 text-white font-semibold shadow-lg shadow-gray-200 active:shadow-sm duration-200 hover:bg-indigo-400 cursor-pointer"
          onClick={() => {
            setEditingTask(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Task
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {columns.map((column) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided) => (
                <TaskColumn
                  column={column}
                  tasks={column.taskIds
                    .map((taskId) => tasks[taskId])
                    .filter(Boolean)}
                  provided={provided}
                  onEditTask={handleEditTask}
                />
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={editingTask ? handleUpdateTask : handleAddTask}
        onDelete={editingTask ? handleDeleteTask : undefined}
        task={editingTask}
        columns={columns}
      />
    </div>
  );
}
