import Truncatable from "react-truncatable";

import {
  TaskWithPopulatedUsers,
  UpdateTaskStatusArgs,
} from "@/types/task.types";
import ImportantIcon from "@/icons/ImportantIcon";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Button } from "@/ui/button";

import { TASK_MARKER_ClASSES, TASK_STATUS_ClASSES } from "@/constants/colors";

import { TASK_STATUS } from "@/constants/task-status";
import { cn } from "@/lib/utils";

interface Props {
  task: TaskWithPopulatedUsers;
  onUpdateStatus: (args: UpdateTaskStatusArgs) => void;
}

const TaskCard = ({ task, onUpdateStatus }: Props) => {
  const handleTaskStatusChange = (status: TASK_STATUS) => {
    onUpdateStatus({
      taskId: task.id as string,
      status,
    });
  };

  return (
    <article className="bg-white border rounded-xl grid grid-rows-[50px_minmax(0,1fr)_24px_42px] gap-1 p-4">
      <header className="items-start font-semibold btwn space-x-1.5">
        <ImportantIcon
          className={cn("w-6 h-6", {
            [TASK_MARKER_ClASSES.Done]: TASK_STATUS.DONE === task.status,
            [TASK_MARKER_ClASSES.Ongoing]: TASK_STATUS.ONGOING === task.status,
            [TASK_MARKER_ClASSES["To Do"]]: TASK_STATUS.TODO === task.status,
          })}
        />

        <h5 className="flex-1">{task.name}</h5>

        <Select onValueChange={handleTaskStatusChange} value={task.status}>
          <SelectTrigger
            className={cn("rounded-full w-unset", {
              [TASK_STATUS_ClASSES.Done]: TASK_STATUS.DONE === task.status,
              [TASK_STATUS_ClASSES.Ongoing]:
                TASK_STATUS.ONGOING === task.status,
              [TASK_STATUS_ClASSES["To Do"]]: TASK_STATUS.TODO === task.status,
            })}
          >
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={TASK_STATUS.TODO}>
                {TASK_STATUS.TODO}
              </SelectItem>
              <SelectItem value={TASK_STATUS.ONGOING}>
                {TASK_STATUS.ONGOING}
              </SelectItem>
              <SelectItem value={TASK_STATUS.DONE}>
                {TASK_STATUS.DONE}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </header>
    </article>
  );
};

export default TaskCard;
