"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Plus,
  Trash2,
  Edit,
  Clock,
  Check,
  Sun,
  Moon,
} from "lucide-react";
import { format, parseISO, isToday, isTomorrow, isYesterday } from "date-fns";
import { DatePicker } from "@/components/DatePicker";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { EmptyState } from "@/components/EmptyState";
import {
  saveTasksToLocalStorage,
  getTasksFromLocalStorage,
} from "@/lib/storage";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export default function DailyPlanner() {
  const { theme, setTheme } = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<
    Record<
      string,
      Array<{
        id: string;
        title: string;
        description?: string;
        startTime: string;
        endTime: string;
        completed: boolean;
      }>
    >
  >({});
  const [editingTask, setEditingTask] = useState<{
    id: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    completed: boolean;
  } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>("default");

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => console.log("SW registered:", registration))
        .catch((error) => console.error("SW registration failed:", error));
    }
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
      if (Notification.permission === "default") {
        requestNotificationPermission();
      }
    }
  }, []);

  useEffect(() => {
    const storedTasks = getTasksFromLocalStorage();
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  useEffect(() => {
    saveTasksToLocalStorage(tasks);
    setupNotifications();
  }, [tasks]);

  const setupNotifications = () => {
    if ("Notification" in window && Notification.permission === "granted" && navigator.serviceWorker) {
      navigator.serviceWorker.ready.then((registration) => {
        console.log("Setting up notifications...");
        Object.entries(tasks).forEach(([dateKey, taskList]) => {
          const taskDate = new Date(dateKey);
          console.log(`Processing tasks for ${dateKey}`);
          taskList.forEach((task) => {
            const [hours, minutes] = task.startTime.split(':').map(Number);
            const notificationTime = new Date(taskDate);
            notificationTime.setHours(hours, minutes, 0, 0);
            const now = new Date();
            console.log(`Task: ${task.title}, Scheduled: ${notificationTime}, Now: ${now}`);
            if (notificationTime > now) {
              const timeUntilNotification = notificationTime.getTime() - now.getTime();
              console.log(`Scheduling notification in ${timeUntilNotification} ms`);
              // Check if active service worker exists before posting message
              if (registration.active) {
                registration.active.postMessage({
                  type: 'scheduleNotification',
                  task,
                  dateKey,
                });
              } else {
                console.warn("No active service worker available for posting message.");
              }
              // Test with a 10-second delay
              const testDelay = 10000;
              setTimeout(() => {
                console.log(`Test notification for ${task.title}`);
                new Notification('Test Reminder', {
                  body: `Test for: ${task.title}`,
                  icon: '/android-icon-192x192.png',
                });
              }, testDelay);
            }
          });
        });
      });
    }
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      try {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        if (permission === "granted") {
          setupNotifications();
        }
      } catch (error) {
        console.error("Notification permission error:", error);
      }
    }
  };
  const dateKey = format(selectedDate, "yyyy-MM-dd");
  const currentDateTasks = tasks[dateKey] || [];

  const handleAddTask = (newTask: {
    id: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    completed: boolean;
  }) => {
    if (editingTask) {
      const updatedTasks = currentDateTasks.map((task) =>
        task.id === editingTask.id ? newTask : task
      );
      setTasks({ ...tasks, [dateKey]: updatedTasks });
      setEditingTask(null);
    } else {
      setTasks({
        ...tasks,
        [dateKey]: [...currentDateTasks, newTask],
      });
    }
    setIsDialogOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = currentDateTasks.filter((task) => task.id !== taskId);
    setTasks({ ...tasks, [dateKey]: updatedTasks });
  };

  const handleDeleteAllTasks = () => {
    const updatedTasks = { ...tasks };
    delete updatedTasks[dateKey];
    setTasks(updatedTasks);
  };

  const toggleTaskCompletion = (taskId: string) => {
    const updatedTasks = currentDateTasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks({ ...tasks, [dateKey]: updatedTasks });
  };

  const getDateTitle = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "EEEE, MMMM d");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url('/plan.jpg')`,
      }}
    >
      <div className="min-h-screen  bg-black/50 backdrop-blur-[10] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-5xl min-h-[80vh] bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
              <motion.div
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                  Task Planner
                </h1>
                <div className="flex items-center mt-1 text-gray-600 dark:text-gray-300">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="text-base sm:text-lg font-medium">
                    {getDateTitle(selectedDate)}
                  </span>
                </div>
              </motion.div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-gray-600 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded-full w-10 h-10 sm:w-12 sm:h-12"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </Button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3"
            >
              <DatePicker
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
              <div className="flex flex-wrap gap-2 w-full">
                <Button
                  onClick={() => {
                    setEditingTask(null);
                    setIsDialogOpen(true);
                  }}
                  className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm sm:text-base py-2 sm:py-2.5"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
                {currentDateTasks.length > 0 && (
                  <Button
                    onClick={handleDeleteAllTasks}
                    variant="outline"
                    className="flex-1 sm:flex-none border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm sm:text-base py-2 sm:py-2.5"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                )}
              </div>
            </motion.div>
            <AnimatePresence>
              {notificationPermission !== "granted" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-4 p-4 bg-blue-100/80 dark:bg-blue-900/50 rounded-lg flex items-center justify-between"
                >
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    Enable notifications for task reminders
                  </div>
                  <Button
                    size="sm"
                    onClick={requestNotificationPermission}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    Enable
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {currentDateTasks.length > 0 ? (
                <TaskList
                  tasks={currentDateTasks}
                  onEditTask={(task) => {
                    setEditingTask(task);
                    setIsDialogOpen(true);
                  }}
                  onDeleteTask={handleDeleteTask}
                  onToggleComplete={toggleTaskCompletion}
                />
              ) : (
                <EmptyState onAddTask={() => setIsDialogOpen(true)} />
              )}
            </motion.div>
          </div>
        </motion.div>

        <TaskForm
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setEditingTask(null);
          }}
          onSubmit={handleAddTask}
          initialTask={editingTask}
        />
      </div>
    </div>
  );
}
