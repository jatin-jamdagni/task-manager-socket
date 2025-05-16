export let boardData = {
  tasks: {
    "task-1": {
      id: "task-1",
      title: "Research competitors",
      description: "Analyze top 5 competitors in the market",
      columnId: "todo",
      priority: "high",
      tags: ["research", "marketing"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    "task-2": {
      id: "task-2",
      title: "Design homepage mockup",
      description: "Create wireframes for the new homepage",
      columnId: "in-progress",
      priority: "medium",
      tags: ["design", "ui"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    "task-3": {
      id: "task-3",
      title: "Fix login bug",
      description: "Users are unable to login with Google account",
      columnId: "done",
      priority: "high",
      tags: ["bug", "auth"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  columns: [
    {
      id: "todo",
      title: "To Do",
      taskIds: ["task-1"],
    },
    {
      id: "in-progress",
      title: "In Progress",
      taskIds: ["task-2"],
    },
    {
      id: "done",
      title: "Done",
      taskIds: ["task-3"],
    },
  ],
};
