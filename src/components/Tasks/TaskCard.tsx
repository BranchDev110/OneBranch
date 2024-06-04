import { useState } from "react";

import Truncatable from "react-truncatable";
import { format } from "date-fns/format";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { TASK_MARKER_CLASSES, TASK_STATUS_ClASSES } from "@/constants/colors";

import { TASK_STATUS } from "@/constants/task-status";
import { cn } from "@/lib/utils";
import { AppUserProfile } from "@/types/user.types";
import { ROLES } from "@/constants/roles";
import AvatarStack from "@/ui/avatar-stack";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import AttachmentIcon from "@/icons/AttachmentIcon";
import EditTaskModal from "./EditTaskModal";

import InviteUsersModal from "@/components/Users/InviteUsersModal";

interface Props {
  task: TaskWithPopulatedUsers;
  onUpdateStatus: (args: UpdateTaskStatusArgs) => void;
  user: AppUserProfile;
  isUpdatingStatus?: boolean;
  team: AppUserProfile[];
  projectName: string;
}

const TaskCard = ({
  task,
  onUpdateStatus,
  user,
  isUpdatingStatus,
  team = [],
  projectName,
}: Props) => {
  const [open, setOpen] = useState(false);

  const handleTaskStatusChange = (status: TASK_STATUS) => {
    onUpdateStatus({
      taskId: task.id as string,
      status,
    });
  };

  const disableTaskStatus = () => {
    let disabled = true;

    const ids = task.assignees.map((c) => c?.id);

    if (
      ids.includes(user?.id as string) ||
      task.createdBy === (user?.id as string) ||
      user.role === ROLES.ADMIN ||
      !isUpdatingStatus
    ) {
      disabled = false;
    }

    return disabled;
  };

  const memberOptions = team.filter((t) => t.id !== task.createdBy);

  return (
    <article className="bg-white border rounded-xl grid grid-rows-[50px_minmax(0,1fr)_24px_42px] gap-1 p-4">
      <header className="items-start font-semibold btwn space-x-1.5">
        <ImportantIcon
          className={cn("w-6 h-6", {
            [TASK_MARKER_CLASSES.Done]: TASK_STATUS.DONE === task.status,
            [TASK_MARKER_CLASSES.Ongoing]: TASK_STATUS.ONGOING === task.status,
            [TASK_MARKER_CLASSES["To Do"]]: TASK_STATUS.TODO === task.status,
          })}
        />

        <h5 className="flex-1">{task.name}</h5>

        <Select
          disabled={disableTaskStatus()}
          onValueChange={handleTaskStatusChange}
          value={task.status}
        >
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

        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger className="p-2" aria-label="Task Actions Menu">
            <DotsVerticalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="">
            <EditTaskModal
              memberOptions={memberOptions}
              task={task}
              closeModal={setOpen}
              user={user}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <Truncatable
        className="text-xs text-c5-300 min-h-[50px]"
        as="p"
        content={task.description}
      />

      <p className="text-xs font-semibold">
        <span className="text-c3">Deadline</span>
        <span>: {format(new Date(task.dueDate), "eo LLLL yyyy")}</span>
      </p>

      <footer className="btwn">
        <div className="start">
          <AvatarStack
            avatars={task.assignees.map((a) => ({
              name: a?.name || "",
              src: a?.avatarUrl || "",
            }))}
            limit={3}
          />
          {/* chnage to modal later */}
          <InviteUsersModal
            projectName={projectName}
            adminName={user.name}
            taskId={task.id as string}
            projectId={task.projectId}
            disabled={user.role !== ROLES.ADMIN}
            invitedBy={user?.id as string}
          />
        </div>

        <div className="space-x-2 text-xs end">
          <span className="space-x-0.5 font-bold text-center end text-c5-400">
            <AttachmentIcon className="w-6 h-6" />
            <span>{task.fileUrls.length}</span>
          </span>
        </div>
      </footer>
    </article>
  );
};

export default TaskCard;
