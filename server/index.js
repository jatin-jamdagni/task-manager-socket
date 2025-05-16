import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const server = http.createServer(app);

let boardData = {
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../client/dist")));

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.get("/api/board", (req, res) => {
  res.json(boardData);
});

app.post("/api/tasks", (req, res) => {
  const newTask = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  boardData.tasks[newTask.id] = newTask;

  const columnIndex = boardData.columns.findIndex(
    (col) => col.id === newTask.columnId
  );
  if (columnIndex !== -1) {
    boardData.columns[columnIndex].taskIds.push(newTask.id);
  }

  io.emit("board-update", boardData);

  res.status(201).json(newTask);
});

app.put("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const task = boardData.tasks[id];

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  const updatedTask = {
    ...task,
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  boardData.tasks[id] = updatedTask;

  if (task.columnId !== updatedTask.columnId) {
    const oldColumnIndex = boardData.columns.findIndex(
      (col) => col.id === task.columnId
    );
    if (oldColumnIndex !== -1) {
      boardData.columns[oldColumnIndex].taskIds = boardData.columns[
        oldColumnIndex
      ].taskIds.filter((taskId) => taskId !== id);
    }

    const newColumnIndex = boardData.columns.findIndex(
      (col) => col.id === updatedTask.columnId
    );
    if (newColumnIndex !== -1) {
      boardData.columns[newColumnIndex].taskIds.push(id);
    }
  }

  io.emit("board-update", boardData);

  res.json(updatedTask);
});

app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const task = boardData.tasks[id];

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  delete boardData.tasks[id];

  const columnIndex = boardData.columns.findIndex(
    (col) => col.id === task.columnId
  );
  if (columnIndex !== -1) {
    boardData.columns[columnIndex].taskIds = boardData.columns[
      columnIndex
    ].taskIds.filter((taskId) => taskId !== id);
  }

  io.emit("board-update", boardData);

  res.status(204).send();
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.emit("board-update", boardData);

  socket.on("update-board", (data) => {
    boardData = data;
    socket.broadcast.emit("board-update", boardData);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log(`- Backend: http://localhost:${PORT}`);
