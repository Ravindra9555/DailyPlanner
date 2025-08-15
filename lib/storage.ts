export function saveTasksToLocalStorage(tasks: Record<string, Array<{
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  completed: boolean;
}>>) {
  localStorage.setItem('dailyPlannerTasks', JSON.stringify(tasks));
}

export function getTasksFromLocalStorage(): Record<string, Array<{
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  completed: boolean;
}>> | null {
  const tasks = localStorage.getItem('dailyPlannerTasks');
  return tasks ? JSON.parse(tasks) : null;
}