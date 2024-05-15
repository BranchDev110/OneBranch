export interface CreateNewUserBody {
  name: string;
  id: string;
  //   TO DO: Add other fields
}

export interface UserProfile {
  name: string;
  id: string;
  role: string;
  avatarUrl: "";
}
