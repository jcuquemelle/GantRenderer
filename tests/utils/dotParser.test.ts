import {parseDotFile} from '../../src/utils/dotParser';
import {Task} from '../../src/types/diagram';
import {readFileSync} from "fs";
import { resolve } from 'path';

describe('parseDotFile', () => {
  it('parses a valid DOT file correctly', () => {
    const dotContent = 'digraph { A [label="Task A", effort="3"]; B [label="Task B", effort="2"]; A -> B }';
    const expectedTasks: Task[] = [
      { id: 'A', label: 'Task A', effort: 3, dependencies: [] },
      { id: 'B', label: 'Task B', effort: 2, dependencies: ['A'] }
    ];
    const result = parseDotFile(dotContent, false);
    expect(result).toEqual(expectedTasks);
  });

  it('parses a valid DOT file with reverse flag', () => {
    const dotContent = 'digraph { A [label="Task A", effort="3"]; B [label="Task B", effort="2"]; A -> B }';
    const expectedTasks: Task[] = [
      { id: 'A', label: 'Task A', effort: 3, dependencies: ['B'] },
      { id: 'B', label: 'Task B', effort: 2, dependencies: [] }
    ];
    const result = parseDotFile(dotContent, true);
    expect(result).toEqual(expectedTasks);
  });

  it('handles nodes without effort attribute', () => {
    const dotContent = 'digraph { A [label="Task A"]; B [label="Task B"]; A -> B }';
    const expectedTasks: Task[] = [
      { id: 'A', label: 'Task A', effort: 1, dependencies: [] },
      { id: 'B', label: 'Task B', effort: 1, dependencies: ['A'] }
    ];
    const result = parseDotFile(dotContent, false);
    expect(result).toEqual(expectedTasks);
  });

  it('handles nodes without label attribute', () => {
    const dotContent = 'digraph { A [effort="3"]; B [effort="2"]; A -> B }';
    const expectedTasks: Task[] = [
      { id: 'A', label: 'A', effort: 3, dependencies: [] },
      { id: 'B', label: 'B', effort: 2, dependencies: ['A'] }
    ];
    const result = parseDotFile(dotContent, false);
    expect(result).toEqual(expectedTasks);
  });

  it('throws an error for invalid DOT file format', () => {
    const invalidDotContent = 'invalid content';
    expect(() => parseDotFile(invalidDotContent, false)).toThrow('Invalid DOT file format');
  });


  it('parses a valid DOT file from resource correctly', () => {

      const expectedTasks: Task[] = [
        {id: 'A', label: 'Task A', effort: 3, dependencies: []},
        {id: 'B', label: 'Task B', effort: 2, dependencies: ['A']}
      ];
      const result = readResource('graph.dot');
      const tasks = parseDotFile(result, false);
      expect(tasks).toEqual(expectedTasks);
    })
});



const readResource= (filePath: string): string => {
  const resolvedPath = resolve(__dirname, '..', 'resources', filePath);
  return readFileSync(resolvedPath, 'utf-8');
};
