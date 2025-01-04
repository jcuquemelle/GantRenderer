import { format, addDays } from 'date-fns';
import { Task } from '../types/diagram';

export const convertToMermaid = (tasks: Task[]): string => {
  const today = new Date();
  const dateFormat = 'yyyy-MM-dd';
  
  // Calculate start dates based on dependencies
  const startDates = new Map<string, Date>();
  
  // Initialize tasks with no dependencies to start today
  tasks.forEach(task => {
    if (task.dependencies.length === 0) {
      startDates.set(task.id, today);
    }
  });

  // Generate Mermaid Gantt chart
  const lines = [
    'gantt',
    '  dateFormat YYYY-MM-DD',
    '  title Task Dependencies Gantt Chart',
    '  section Tasks'
  ];

  tasks.forEach(task => {
    const deps = task.dependencies.length > 0 
      ? `after ${task.dependencies.join(' ')}`
      : format(startDates.get(task.id)!, dateFormat);
    
    lines.push(`  ${task.label} :${task.id}, ${deps}, ${task.effort}d`);
  });

  return lines.join('\n');
};