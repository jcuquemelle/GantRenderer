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

function reverseGraph(graph: Graph) {
  graph.edges().forEach(edge => {
    const previous = graph.edge(edge.v, edge.w);
    graph.setEdge(edge.w, edge.v, previous.label, previous.name);
    graph.removeEdge(edge.v, edge.w);
  });
}
