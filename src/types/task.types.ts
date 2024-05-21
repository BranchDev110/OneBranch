import { TASK_STATUS } from "@/constants/task-status";

export interface Task {
  id: string | number;
  name: string;
  description: string;
  sprintId: string;
  projectId: string;
  assignees: string[];
  createdBy: string;
  storyPoint: number;
  dueDate: string;
  status: TASK_STATUS | string;
}
