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
}
