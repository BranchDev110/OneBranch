export interface CreateProjectBody {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  admin: string;
  members: string[];
  currentPoints: number;
  totalPoints: number;
  columns: string[];
  imageUrl: string;
}

export interface Project extends CreateProjectBody {
  id: string;
}
