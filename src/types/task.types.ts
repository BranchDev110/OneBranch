import { TASK_STATUS } from "@/constants/task-status";

export interface Task {
  id: string | number;
  name: string;
  description: string;
  sprint_id: string;
  project_id: string;
  //maybe string[] to support multiple assignees
  assignee_id: string;
  create_user_id: string;
  story_point: number;
  is_completed: boolean;
  due_date: string;
  status: TASK_STATUS | string;
}
