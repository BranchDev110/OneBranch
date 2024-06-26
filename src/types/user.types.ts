export interface CreateNewUserBody {
  name: string;
  id: string;
  email: string;
  //   TO DO: Add other fields
}

export interface AppUserProfile {
  name: string;
  id: string;
  role: string;
  avatarUrl: string;
  email: string;
}

export interface UpdateUserProfileBody {
  name: string;
  id: string;
  avatarUrl: string;
  email: string;
  oldEmail: string;
}
