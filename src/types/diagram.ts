export interface Task {
  id: string;
  label: string;
  effort: number;
  dependencies: string[];
}