import { TASK_STATUS } from "@/constants/task-status";
import { AppUserProfile } from "./user.types";

export interface Task {
  id: string | number;
  name: string;
  description: string;
  sprintId: string;
  projectId: string;
  assignees: string[];
  fileUrls: string[];
  createdBy: string;
  storyPoint: number;
  dueDate: string;
  status: TASK_STATUS | string;
  order: number;
}

export interface TaskWithPopulatedUsers extends Omit<Task, "assignees"> {
  assignees: AppUserProfile[];
}

export interface UpdateTaskStatusArgs {
  taskId: string;
  status: TASK_STATUS;
}

export interface CreateTaskBody {
  name: string;
  description: string;
  sprintId: string;
  projectId: string;
  assignees: string[];
  fileUrls: string[];
  createdBy: string;
  storyPoint: number;
  dueDate: string;
  status: TASK_STATUS;
}

export interface CreateTaskBodyFull extends CreateTaskBody {
  order: number;
}
