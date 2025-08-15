'use client';

import { ClipboardList, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onAddTask: () => void;
}

export function EmptyState({ onAddTask }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-lg font-medium text-gray-900">No tasks yet</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by adding your first task.
      </p>
      <div className="mt-6">
        <Button onClick={onAddTask}>
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>
    </div>
  );
}