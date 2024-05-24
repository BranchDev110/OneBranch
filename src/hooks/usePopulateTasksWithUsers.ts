import { useMemo } from "react";
import useUsersMap from "./useUsersMap";

import { TaskWithPopulatedUsers, Task } from "@/types/task.types";
import { AppUserProfile } from "@/types/user.types";

interface Props {
  tasks: Task[];
  users: AppUserProfile[];
}

const usePopulateTasksWithUsers = ({ tasks = [], users = [] }: Props) => {
  const { userMap } = useUsersMap({ users });

  const populatedTasks: TaskWithPopulatedUsers[] = useMemo(() => {
    return tasks.map((t) => {
      const populatedAssignees = t.assignees.map((u) => userMap[u]);

      return {
        ...t,
        assignees: populatedAssignees,
      };
    });
  }, [userMap, tasks]);

  return {
    populatedTasks,
  };
};

export default usePopulateTasksWithUsers;
