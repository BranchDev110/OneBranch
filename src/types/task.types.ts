import { TASK_STATUS } from "@/constants/task-status";
import { AppUserProfile } from "./user.types";

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

export interface TaskWithPopulatedUsers extends Omit<Task, "assignees"> {
  assignees: AppUserProfile[];
}

export interface UpdateTaskStatusArgs {
  taskId: string;
  status: TASK_STATUS;
}
