import { read } from 'graphlib-dot';
import { Task } from '../types/diagram';
import { Graph } from 'graphlib';

export const parseDotFile = (content: string, reverse: boolean): Task[] => {
  try {
    var graph = read(content);
    if (reverse) {
      reverseGraph(graph);
    }
    const tasks: Task[] = [];
    const nodes = graph.nodes();
    
    // Process nodes
    nodes.forEach(nodeId => {
      const nodeAttrs = graph.node(nodeId);
      const label = nodeAttrs?.label || nodeId;
      if (!/^sg\d+$/.test(label)) {
        tasks.push({
          id: getNodeId(nodeId),
          label: (nodeAttrs?.label || nodeId).replace(/C#/g, 'CS'),
          effort: parseInt(nodeAttrs?.effort || '1', 10),
          dependencies: []
        });
      }
    });

    // Process edges
    graph.edges().forEach(edge => {
      const task = tasks.find(t => t.id === edge.w);
      if (task) {
        task.dependencies.push(getNodeId(edge.v));
      }
    });

    return tasks;
  } catch (error) {
    console.error(error);
    throw new Error(`Invalid DOT file format: ${error} | line: ${error.line}`);
  }
};

function reverseGraph(graph: Graph) {
  graph.edges().forEach(edge => {
    const previous = graph.edge(edge.v, edge.w);
    graph.setEdge(edge.w, edge.v, previous.label, previous.name);
    graph.removeEdge(edge.v, edge.w);
  });
}

const getNodeId = (task: string): string => {
  task = task.replace(/\n/g, ' ')
  task = task.replace(/C#/g, 'CS')
  if (!task.includes(' ')) {
    return task;
  }
  return task
    .split(' ')
    .map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}
