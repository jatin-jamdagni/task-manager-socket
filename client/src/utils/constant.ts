import type { Column } from "../types";

export const initialColumns: Column[] = [
  {
    id: "todo",
    title: "To Do",
    taskIds: [],
  },
  {
    id: "in-progress",
    title: "In Progress",
    taskIds: [],
  }, 
  {
    id: "done",
    title: "Done",
    taskIds: [],
  },
];