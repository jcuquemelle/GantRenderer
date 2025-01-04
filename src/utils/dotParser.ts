import { read } from 'graphlib-dot';
import { Task } from '../types/diagram';

export const parseDotFile = (content: string): Task[] => {
  try {
    const graph = read(content);
    const tasks: Task[] = [];
    const nodes = graph.nodes();
    
    // Process nodes
    nodes.forEach(nodeId => {
      const nodeAttrs = graph.node(nodeId);
      tasks.push({
        id: nodeId,
        label: nodeAttrs?.label || nodeId,
        effort: parseInt(nodeAttrs?.effort || '1', 10),
        dependencies: []
      });
    });

    // Process edges
    graph.edges().forEach(edge => {
      const task = tasks.find(t => t.id === edge.w);
      if (task) {
        task.dependencies.push(edge.v);
      }
    });

    return tasks;
  } catch (error) {
    console.error('Error parsing DOT file:', error);
    throw new Error('Invalid DOT file format');
  }
};