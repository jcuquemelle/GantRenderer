import { readFileSync } from 'fs';
import { resolve } from 'path';
import { convertToMermaid, dateFormat } from '../../src/utils/ganttConverter';
import { Task } from '../../src/types/diagram';
import mermaid from "mermaid";
import {parseDotFile} from "../../src/utils/dotParser";
import {format} from "date-fns";

describe('convertToMermaid', () => {
  it('should convert tasks to Mermaid Gantt chart format', () => {
    const filePath = resolve(__dirname, '../resources/tasks.json');
    const fileContent = readFileSync(filePath, 'utf-8');
    const tasks: Task[] = JSON.parse(fileContent);

    const result = convertToMermaid(tasks);
    const today = new Date();
    const todayString = format(today, dateFormat);
    const expectedOutput = `gantt
  dateFormat YYYY-MM-DD
  title Task Dependencies Gantt Chart
  section Tasks
  Task A :A, ${todayString}, 3d
  Task B :B, after A, 2d`;

    expect(result).toBe(expectedOutput);
  });
  
  it('should handle tasks with no dependencies', () => {
    const filePath = resolve(__dirname, '../resources/graph.dot');
    const fileContent = readFileSync(filePath, 'utf-8');
    const tasks: Task[] = parseDotFile(fileContent, false);
    
    
    const result = convertToMermaid(tasks);

    // mermaid.render('mermaid-diagram', result)
    });
});