export interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  projectId: string;
  currentPoints: number;
  totalPoints: number;
  createdBy: string;
}

export interface CreateSprintBody {
  name: string;
  startDate: string;
  endDate: string;
  projectId: string;
  currentPoints: number;
  totalPoints: number;
  createdBy: string;
}
