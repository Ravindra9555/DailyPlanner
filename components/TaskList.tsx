'use client';

import { motion } from 'framer-motion';
import { Clock, Edit, Trash2, Check, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface TaskListProps {
  tasks: Array<{
    id: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    completed: boolean;
  }>;
  onEditTask: (task: {
    id: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    completed: boolean;
  }) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
}
export function TaskList({ tasks, onEditTask, onDeleteTask, onToggleComplete }: TaskListProps) {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {tasks
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
        .map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'p-4 rounded-lg border transition-colors',
              task.completed
                ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            )}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => onToggleComplete(task.id)}
                className={cn(
                  'mt-1 flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center',
                  task.completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-gray-300 dark:border-gray-500'
                )}
              >
                {task.completed && <Check className="w-3 h-3" />}
              </button>
              
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <h3
                    className={cn(
                      'font-medium',
                      task.completed ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-800 dark:text-gray-100'
                    )}
                  >
                    {task.title}
                  </h3>
                  <button
                    onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-2"
                  >
                    {expandedTask === task.id ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>
                    {task.startTime} - {task.endTime}
                  </span>
                </div>
                
                {expandedTask === task.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2"
                  >
                    {task.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        {task.description}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditTask(task)}
                        className="text-gray-700 dark:text-gray-300"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteTask(task.id)}
                        className="text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
    </div>
  );
}