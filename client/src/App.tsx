import React from "react";
import TaskBoard from "./components/task-board";

const App: React.FC = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <TaskBoard />
    </main>
  );
};

export default App;
