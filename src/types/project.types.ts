export interface ProjectColumn {
  name: string;
  id: string;
}

export interface CreateProjectBody {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  admin: string;
  members: string[];
  currentPoints: number;
  totalPoints: number;
  columns: ProjectColumn[];
  imageUrl: string;
}

export interface Project extends Omit<CreateProjectBody, "columns"> {
  id: string;
  columns: string[];
  activeSprintId: string;
  isRemoved?: boolean;
}

export interface EditProjectBody {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  admin: string;
  members: string[];
  currentPoints: number;
  totalPoints: number;
  imageUrl: string;
  newColumns: ProjectColumn[];
  oldColumns: ProjectColumn[];
}

export interface AddUserToProjectAndTaskArgs {
  userId: string;
  email: string;
  projectId: string;
  taskId?: string;
  verifyToken: string;
}

export interface SendInviteArgs {
  emails: string[];
  projectId: string;
  taskId?: string;
  projectName: string;
  originUrl: string;
  adminName: string;
  invitedBy: string;
}

export interface SetActiveSprintForProjectArgs {
  projectId: string;
  sprintId: string;
}
