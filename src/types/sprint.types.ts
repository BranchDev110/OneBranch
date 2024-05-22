export interface Sprint {
  id: string;
  name: string;
  description: string;
  endDate: string;
  startDate: string;

  projectId: string;
  currentPoints: number;
  totalPoints: number;
  createdBy: string;
}

export interface CreateSprintBody {
  name: string;
  description: string;
  endDate: string;
  startDate: string;
  projectId: string;
  currentPoints: number;
  totalPoints: number;
  createdBy: string;
}
