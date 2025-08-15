"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: {
    id: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    completed: boolean;
  }) => void;
  initialTask?: {
    id: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    completed: boolean;
  } | null;
}

export function TaskForm({
  isOpen,
  onClose,
  onSubmit,
  initialTask,
}: TaskFormProps) {
  const [task, setTask] = useState<{
    id: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    completed: boolean;
  }>({
    id: "",
    title: "",
    description: "",
    startTime: "09:00",
    endTime: "10:00",
    completed: false,
  });

  useEffect(() => {
    if (initialTask) {
      setTask(initialTask);
    } else {
      setTask({
        id: uuidv4(),
        title: "",
        description: "",
        startTime: "09:00",
        endTime: "10:00",
        completed: false,
      });
    }
  }, [initialTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.title.trim()) {
      onSubmit(task);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-2xl"
        aria-describedby="task-form-description"
      >
        <DialogHeader>
          <DialogTitle>
            {initialTask ? "Edit Task" : "Add New Task"}
          </DialogTitle>
          <p id="task-form-description" className="sr-only">
            {initialTask
              ? "Edit your task details"
              : "Add a new task to your planner"}
          </p>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="mb-2" htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              placeholder="What do you need to do?"
              required
            />
          </div>

          <div>
            <Label className="mb-2" htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={task.description}
              onChange={(e) =>
                setTask({ ...task, description: e.target.value })
              }
              placeholder="Add details about your task..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-2" htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                value={task.startTime}
                onChange={(e) =>
                  setTask({ ...task, startTime: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label className="mb-2" htmlFor="endTime">End Time *</Label>
              <Input
                id="endTime"
                type="time"
                value={task.endTime}
                onChange={(e) => setTask({ ...task, endTime: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialTask ? "Update Task" : "Add Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
