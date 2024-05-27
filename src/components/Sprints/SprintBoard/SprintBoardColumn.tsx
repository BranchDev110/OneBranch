import { useMemo } from "react";

import { ProjectColumn } from "@/types/project.types";
import { TaskWithPopulatedUsers } from "@/types/task.types";
import { PlusIcon } from "@radix-ui/react-icons";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSprintBoard } from "./useSprintBoard";
import TaskCard from "@/components/Tasks/TaskCard";
import SprintBoardItem from "./SprintBoardItem";
import orderBy from "lodash/orderBy";
import useLoggedInUser from "@/hooks/useLoggedInUser";
import { AppUserProfile } from "@/types/user.types";
import useUpdateTaskStatus from "@/hooks/useUpdateTaskStatus";
import { cn } from "@/lib/utils";

interface Props {
  tasks: TaskWithPopulatedUsers[];
  column: ProjectColumn;
}

const SprintBoardColumn = ({ tasks = [], column }: Props) => {
  const ctx = useSprintBoard();
  const { user } = useLoggedInUser();

  const { onUpdateStatus, isLoading } = useUpdateTaskStatus();

  const orderedTasks = useMemo(
    () =>
      orderBy(tasks, ["order", "storyPoint", "name"], ["asc", "desc", "asc"]),
    [tasks]
  );

  const { setNodeRef, attributes, listeners, transform, transition, isOver } =
    useSortable({
      id: column.id,
      data: {
        type: "Column",
        column,
        itemCount: tasks?.length || 0,
      },
    });

  if (!ctx?.state) {
    return <></>;
  }

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const taskLen = tasks.length;

  //   if (orderedTasks.length) {
  //     console.log({ tasks, orderedTasks });
  //   }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative isolate min-h-[70vh] bg-c5 transition-colors border-l border-r border-b",
        {
          [" border-primary/40"]: isOver,
          ["border-transparent"]: !isOver,
        }
      )}
    >
      <div className="absolute top-0 w-[97%] mx-[1.5%] h-2 -translate-y-1/2 rounded-t-full bg-c2 -z-10"></div>

      <div className="rounded-t-xl bg-c5">
        <div className="p-4 space-x-2 btwn">
          <div className="space-x-3 start">
            <p className="text-lg font-bold">{column.name}</p>
            <span className="w-8 p-1 text-sm font-bold text-center rounded-full bg-c5-400/30 aspect-square center text-c5-300">
              {taskLen}
            </span>
          </div>
          <button
            type="button"
            className="text-lg rounded-full w-7 bg-primary text-c5 center aspect-square"
          >
            <PlusIcon className="stroke-2" />
          </button>
        </div>

        <section {...attributes} {...listeners} className={"space-y-2"}>
          <SortableContext
            strategy={verticalListSortingStrategy}
            items={orderedTasks}
          >
            {orderedTasks.map((t) => (
              <SprintBoardItem task={t} key={t.id}>
                <TaskCard
                  user={user as AppUserProfile}
                  task={t}
                  isUpdatingStatus={isLoading}
                  team={ctx.state.users}
                  onUpdateStatus={onUpdateStatus}
                />
              </SprintBoardItem>
            ))}
          </SortableContext>
        </section>
      </div>
    </div>
  );
};

export default SprintBoardColumn;
