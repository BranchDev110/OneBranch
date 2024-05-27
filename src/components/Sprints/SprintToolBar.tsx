import { TASK_STATUS } from "@/constants/task-status";
import { cn } from "@/lib/utils";
import {
  useCreateTaskMutation,
  useGetTasksInProjectQuery,
} from "@/services/tasks";
import { CreateTaskBody, CreateTaskBodyFull } from "@/types/task.types";
import { AppUserProfile } from "@/types/user.types";
import { useMemo } from "react";
import { toast } from "sonner";
import ImportTaskToSprint from "./ImportTaskToSprint";

interface Props {
  user?: AppUserProfile;
  sprintId: string;
  projectId: string;
  team: AppUserProfile[];
  newTaskOrder: number;
  status: TASK_STATUS | "";
  setStatus: (status: TASK_STATUS | "") => void;
}

const SprintToolBar = ({
  user,
  projectId,
  team = [],
  sprintId,
  newTaskOrder,
  status,
  setStatus,
}: Props) => {
  const [createTask, createRes] = useCreateTaskMutation();

  const { data: allTasks = [] } = useGetTasksInProjectQuery(projectId, {
    skip: !projectId,
  });

  const selectableMembers = team.filter((m) => m.id !== user?.id);

  const onCreateTask = (values: Omit<CreateTaskBody, "status">) => {
    toast.dismiss();
    toast.loading("Creating task...");

    try {
      const body: CreateTaskBodyFull = {
        name: values.name,
        description: values.description,
        sprintId: "",
        projectId,
        assignees: values.assignees,
        createdBy: user?.id as string,
        storyPoint: values.storyPoint,
        dueDate: values.dueDate,
        status: TASK_STATUS.TODO,
        fileUrls: values.fileUrls,
        order: newTaskOrder,
      };

      console.log(body);

      // await createTask(body).unwrap();

      toast.dismiss();
      toast.success("Created task");
    } catch (error: any) {
      toast.dismiss();

      const msg = error?.message || "Unable to create task for project";
      toast.error(msg);
    }
  };

  const onFilter = (val: TASK_STATUS | "") => () => setStatus(val);

  const tasksWithNoSprint = useMemo(() => {
    return allTasks.filter((t) => t.sprintId === "");
  }, [allTasks]);

  return (
    <>
      <div className="space-x-3 start">
        <button>next</button>
        <div className="flex-1 p-4 bg-white rounded-xl min-h-12 btwn spaxe-x-2">
          <div className="space-x-2 text-sm font-semibold start ">
            <button
              onClick={onFilter("")}
              type="button"
              className={cn("relative px-3 py-1 text-c5-300 ", {
                ["text-primary"]: status === "",
              })}
            >
              All
              <span
                className={cn(
                  "absolute top-0 inline-block w-1 -translate-x-1/2 -translate-y-1/2 rounded-full left-1/2 aspect-square bg-primary transition-colors opacity-0",
                  {
                    ["opacity-100"]: status === "",
                  }
                )}
              ></span>
            </button>
            {[TASK_STATUS.TODO, TASK_STATUS.ONGOING, TASK_STATUS.DONE].map(
              (c) => (
                <button
                  key={c}
                  type="button"
                  onClick={onFilter(c)}
                  className={cn("relative px-3 py-1 text-c5-300 ", {
                    ["text-primary"]: status === c,
                  })}
                >
                  {c}

                  <span
                    className={cn(
                      "absolute top-0 inline-block w-1 -translate-x-1/2 -translate-y-1/2 rounded-full left-1/2 aspect-square bg-primary transition-colors opacity-0",
                      {
                        ["opacity-100"]: status === c,
                      }
                    )}
                  ></span>
                </button>
              )
            )}
          </div>

          <ImportTaskToSprint
            tasks={tasksWithNoSprint}
            sprintId={sprintId}
            order={newTaskOrder}
          />
        </div>
      </div>
    </>
  );
};

export default SprintToolBar;
