import { AppUserProfile } from "@/types/user.types";
import { useMemo } from "react";

interface Props {
  users: AppUserProfile[];
}

const useUsersMap = ({ users = [] }: Props) => {
  const userMap = useMemo(() => {
    return users.reduce((list, user) => {
      list[user.id] = user;
      return list;
    }, {} as Record<string, AppUserProfile>);
  }, [users]);

  return { userMap };
};

export default useUsersMap;
