import { parseDotFile } from './dotParser';
import { convertToMermaid } from './ganttConverter';

const isDotContent = (content: string): boolean => {
  // Remove comments and whitespace
  const cleanContent = content
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')
    .trim();
  
  // Check if content starts with "digraph" or "graph"
  return /^(di)?graph\s*(\w+\s*)?\{/i.test(cleanContent);
};

const isMermaidContent = (content: string): boolean => {
  const cleanContent = content.trim().toLowerCase();
  return cleanContent.startsWith('gantt') || 
         cleanContent.startsWith('sequencediagram') ||
         cleanContent.startsWith('classDiagram') ||
         cleanContent.startsWith('flowchart') ||
         cleanContent.startsWith('erdiagram');
};

export const detectDiagramType = (content: string): string => {
  if (isDotContent(content)) return '.dot';
  if (isMermaidContent(content)) return '.mmd';
  throw new Error('Unsupported diagram format');
};

export const convertDotToMermaid = (dotContent: string): string => {
  const tasks = parseDotFile(dotContent);
  return convertToMermaid(tasks);
};

export const processDiagramContent = (content: string, fileType?: string): string => {
  // If no fileType is provided or it's auto-detected, determine from content
  const detectedType = fileType || detectDiagramType(content);
  
  if (detectedType === '.dot') {
    return convertDotToMermaid(content);
  }
  return content;
};