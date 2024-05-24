import { useMemo, useState } from "react";
import TaskCard from "./TaskCard";
import usePopulateTasksWithUsers from "@/hooks/usePopulateTasksWithUsers";
import { AppUserProfile } from "@/types/user.types";
import { Task, UpdateTaskStatusArgs } from "@/types/task.types";
import { matchSorter } from "match-sorter";
import { Input } from "@/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import useLoggedInUser from "@/hooks/useLoggedInUser";
import { toast } from "sonner";
import { useUpdateTaskStatusMutation } from "@/services/tasks";

interface Props {
  users: AppUserProfile[];
  tasks: Task[];
}

const TasksContainer = ({ tasks = [], users = [] }: Props) => {
  const { user } = useLoggedInUser();
  const { populatedTasks = [] } = usePopulateTasksWithUsers({ tasks, users });

  const [updateStatus, { isLoading }] = useUpdateTaskStatusMutation();

  const onUpdateStatus = async (args: UpdateTaskStatusArgs) => {
    try {
      // console.log(args);
      toast.dismiss();
      toast.loading("Updating task status...");

      await updateStatus(args).unwrap();

      toast.dismiss();
      toast.success("Updated task status");
    } catch (error: any) {
      toast.dismiss();

      const msg = error?.message || "Unable to update task status";
      toast.error(msg);
    }
  };

  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  const data = useMemo(() => {
    let filteredTasks = populatedTasks;

    if (query?.trim()) {
      filteredTasks = matchSorter(populatedTasks, query, {
        keys: ["name", "description"],
        threshold: matchSorter.rankings.CONTAINS,
      });
    }

    return filteredTasks;
  }, [query, populatedTasks]);

  return (
    <div>
      <div className="end">
        <div className="relative basis-2/3">
          <i className="absolute -translate-y-1/2 left-2 top-1/2">
            <MagnifyingGlassIcon />
          </i>
          <Input
            value={query}
            onChange={handleChange}
            placeholder="Search tasks...."
            className="block w-full pl-7 bg-c5-50 rounded-xl"
            type="search"
          />
        </div>
      </div>

      <div className="gap-2 mt-4 grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] grid-flow-dense">
        {data?.length ? (
          <>
            {data.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdateStatus={onUpdateStatus}
                user={user as AppUserProfile}
                isUpdatingStatus={isLoading}
                team={users}
              />
            ))}
          </>
        ) : (
          <div className="w-full min-h-[20vh] p-2 text-center center col-span-full ">
            <h1 className="text-xl font-bold ">No tasks found</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksContainer;
