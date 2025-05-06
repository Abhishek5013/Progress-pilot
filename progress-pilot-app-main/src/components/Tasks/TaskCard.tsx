
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EditTaskDialog } from "./EditTaskDialog";
import { DeleteTaskDialog } from "./DeleteTaskDialog";
import { Task } from "@/types";

interface TaskCardProps {
  task: Task;
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
}

const TaskCard = ({ task, onTaskUpdate, onTaskDelete }: TaskCardProps) => {
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "todo":
        return "status-badge status-badge-todo";
      case "in progress":
        return "status-badge status-badge-inprogress";
      case "done":
        return "status-badge status-badge-done";
      default:
        return "status-badge status-badge-todo";
    }
  };

  const handleStatusChange = (newStatus: string) => {
    onTaskUpdate({
      ...task,
      status: newStatus,
      completedAt: newStatus === "Done" ? new Date().toISOString() : null,
    });
  };

  return (
    <Card className="task-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{task.title}</CardTitle>
          <div className={getStatusBadgeClass(task.status)}>{task.status}</div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-500 mb-4">{task.description}</p>
        <div className="text-xs text-gray-400">
          Created: {new Date(task.createdAt).toLocaleDateString()}
          {task.completedAt && (
            <span className="ml-4">
              Completed: {new Date(task.completedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="flex gap-2">
          <EditTaskDialog task={task} onTaskUpdate={onTaskUpdate} />
          <DeleteTaskDialog taskId={task.id} onTaskDelete={onTaskDelete} />
        </div>
        <div className="flex gap-2">
          {task.status !== "Todo" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange("Todo")}
            >
              Set To Do
            </Button>
          )}
          {task.status !== "In Progress" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange("In Progress")}
            >
              Set In Progress
            </Button>
          )}
          {task.status !== "Done" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange("Done")}
            >
              Set Done
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
