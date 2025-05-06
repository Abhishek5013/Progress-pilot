
export interface User {
  id?: string;
  name: string;
  email: string;
  country: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tasksTotal: number;
  tasksCompleted: number;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  completedAt: string | null;
}
