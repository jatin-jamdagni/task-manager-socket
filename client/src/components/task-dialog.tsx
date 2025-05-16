import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { Column, Task } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  columnId: z.string(),
  priority: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  task: Task | null;
  columns: Column[];
}

export default function TaskDialog({
  open,
  onOpenChange,
  onSave,
  onDelete,
  task,
  columns,
}: TaskDialogProps) {
  const [tagInput, setTagInput] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      columnId: columns[0]?.id || "",
      priority: "medium",
      tags: [],
    },
  });

  useEffect(() => {
    if (open) {
      if (task) {
        form.reset({
          title: task.title,
          description: task.description || "",
          columnId: task.columnId,
          priority: task.priority || "medium",
          tags: task.tags || [],
        });
      } else {
        form.reset({
          title: "",
          description: "",
          columnId: columns[0]?.id || "",
          priority: "medium",
          tags: [],
        });
      }
    }
  }, [open, task, form, columns]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const savedTask: Task = {
      id: task?.id || uuidv4(),
      title: values.title,
      description: values.description,
      columnId: values.columnId,
      priority: values.priority,
      tags: values.tags,
      createdAt: task?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(savedTask);
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      const currentTags = form.getValues("tags") || [];
      if (!currentTags.includes(tagInput.trim())) {
        form.setValue("tags", [...currentTags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue(
      "tags",
      currentTags.filter((t) => t !== tag)
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/40 "
        onClick={() => onOpenChange(false)}
      ></div>
      <div className="z-50 grid w-full max-w-lg gap-4  bg-white p-6 shadow-lg rounded-lg">
        <div className="flex flex-col space-y-1.5 text-left ">
          <h2 className="text-lg font-semibold ">
            {task ? "Edit Task" : "Create New Task"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {task
              ? "Update the details of your task."
              : "Add a new task to your board."}
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium ">
              Title
            </label>
            <input
              id="title"
              className="flex h-10 w-full  placeholder:text-gray-300 text-gray-800  rounded-md border border-gray-300   focus:outline-1 focus:outline-gray-500 px-4 "
              placeholder="Task title"
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Description
            </label>
            <textarea
              id="description"
              className="flex h-20 w-full py-1 text-[15px] placeholder:text-gray-300 text-gray-800  rounded-md border border-gray-300   focus:outline-1 focus:outline-gray-500 px-4 "
              placeholder="Task description"
              {...form.register("description")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="columnId"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Status
              </label>
              <select
                id="columnId"
                className="flex h-10 w-full placeholder:text-gray-300 text-gray-800  rounded-md border border-gray-300   focus:outline-1 focus:outline-gray-500 px-4 "
                {...form.register("columnId")}
              >
                {columns.map((column) => (
                  <option key={column.id} value={column.id}>
                    {column.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="priority"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Priority
              </label>
              <select
                id="priority"
                className="flex h-10 w-full placeholder:text-gray-300 text-gray-800  rounded-md border border-gray-300   focus:outline-1 focus:outline-gray-500 px-4 "
                {...form.register("priority")}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.getValues("tags")?.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground"
                >
                  {tag}
                  <button
                    type="button"
                    className="ml-1 h-4 w-4 p-0 hover:text-muted-foreground"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {tag}</span>
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                className="flex h-10 w-full placeholder:text-gray-300 text-gray-800  rounded-md border border-gray-300   focus:outline-1 focus:outline-gray-500 px-4 "
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <button
                type="button"
                className=" flex items-center border rounded-md py-1.5 px-3 bg-indigo-500 text-white font-semibold shadow-lg shadow-gray-200 active:shadow-sm duration-200 hover:bg-indigo-400 cursor-pointer"
                onClick={handleAddTag}
              >
                Add
              </button>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            {onDelete && task && (
              <button
                type="button"
                className="  text-center w-full border rounded-md py-1.5 mt-1 px-3 bg-red-500 text-white font-semibold shadow-lg shadow-gray-200 active:scale-95 duration-200 hover:bg-red-400 cursor-pointer"
                onClick={() => onDelete(task.id)}
              >
                Delete
              </button>
            )}
            <button
              type="button"
                className="  text-center w-full border rounded-md py-1.5 mt-1 px-3 bg-gray-500 text-white font-semibold shadow-lg shadow-gray-200 active:scale-95 duration-200 hover:bg-gray-400 cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
                className="  text-center w-full border rounded-md py-1.5 mt-1 px-3 bg-indigo-500 text-white font-semibold shadow-lg shadow-gray-200 active:scale-95 duration-200 hover:bg-indigo-400 cursor-pointer"
            >
              {task ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
