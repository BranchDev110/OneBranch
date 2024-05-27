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
  isRemoved?: boolean;
  columnId: string;
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
  columnId?: string;
}

export interface CreateTaskBodyFull extends CreateTaskBody {
  order: number;
}

export interface EditTaskBody extends CreateTaskBody {
  id: string;
  oldPoints: number;
}

export interface MoveTaskArgs {
  taskId: string;
  columnId: string;
  order: number;
}

export interface ImportTaskArgs {
  taskId: string;
  sprintId: string;
  order: number;
}
