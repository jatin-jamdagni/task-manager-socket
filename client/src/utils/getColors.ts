  export const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "border text-red-500  bg-red-100  ";
      case "medium":
        return "border text-orange-500  bg-orange-100  ";
      case "low":
        return " border text-green-500 bg-green-100  ";
      default:
        return "border text-slate-500   bg-slate-100  ";
    }
  };

  export const getColumnColor = (columnId: string) => {
    switch (columnId) {
      case "todo":
        return "bg-slate-100 border-slate-200"
      case "in-progress":
        return "bg-blue-100 border-blue-200 "
      case "done":
        return "bg-green-100 border-green-200"
      default:
        return "bg-slate-100 border-slate-200"
    }
  }