import { memo, useRef, useState, createContext, useMemo } from "react";
import { createPortal } from "react-dom";

import usePopulateTasksWithUsers from "@/hooks/usePopulateTasksWithUsers";
import { AppUserProfile } from "@/types/user.types";
import {
  Task,
  CreateTaskBody,
  CreateTaskBodyFull,
  TaskWithPopulatedUsers,
} from "@/types/task.types";
import useUpdateTaskStatus from "@/hooks/useUpdateTaskStatus";
import { ProjectColumn } from "@/types/project.types";
import { useCreateTaskMutation } from "@/services/tasks";
import { toast } from "sonner";
import { TASK_STATUS } from "@/constants/task-status";
import useLoggedInUser from "@/hooks/useLoggedInUser";

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { ScrollArea, ScrollBar } from "@/ui/scroll-area";
import useMeasure from "@/hooks/useMeasure";
import SprintBoardColumn from "./SprintBoardColumn";
import { UseMutationResult } from "@/types/rtk.types";

interface Props {
  users: AppUserProfile[];
  tasks: Task[];
  columns: ProjectColumn[];
  projectId: string;
  sprintId: string;
}

interface BoardActions {
  createTask: () => void;
  moveTask: () => void;
}

interface BoardState extends Props {
  movingState: UseMutationResult<Task>;
  creatingState: UseMutationResult<Task>;
}

interface ISprintBoard {
  actions: BoardActions;
  state: BoardState;
}

export const SprintBoardContext = createContext<ISprintBoard | undefined>(
  undefined
);

const Board = ({
  tasks = [],
  users = [],
  projectId,
  sprintId,
  columns = [],
}: Props) => {
  const { user } = useLoggedInUser();
  const ref = useRef<HTMLDivElement | null>(null);

  const { populatedTasks = [] } = usePopulateTasksWithUsers({ tasks, users });

  const { onUpdateStatus, isLoading } = useUpdateTaskStatus();

  const [createTask, createRes] = useCreateTaskMutation();

  const [activeTask, setActiveTask] = useState<null | TaskWithPopulatedUsers>(
    null
  );

  const onCreateTask =
    (newTaskOrder: number, columnId?: string) =>
    async (values: Omit<CreateTaskBody, "status">) => {
      try {
        toast.dismiss();
        toast.loading("Creating task...");

        const body: CreateTaskBodyFull = {
          name: values.name,
          description: values.description,
          sprintId,
          projectId,
          columnId,
          assignees: values.assignees,
          createdBy: user?.id as string,
          storyPoint: values.storyPoint,
          dueDate: values.dueDate,
          status: TASK_STATUS.TODO,
          fileUrls: values.fileUrls,
          order: newTaskOrder,
        };

        console.log(body);

        //  toast.dismiss();
        //  toast.success("Created task");
      } catch (error: any) {
        toast.dismiss();

        const msg = error?.message || "Unable to create task";
        toast.error(msg);
      }
    };

  const handleDragOver = (event: DragOverEvent) => {};
  const handleDragStart = (event: DragStartEvent) => {
    setActiveTask(event.active.data.current.task);
  };
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
  };

  const { dimensions } = useMeasure({ ref });

  const value: ISprintBoard = useMemo(
    () => ({
      state: {
        users,
        tasks,
        projectId,
        sprintId,
        columns,
        creatingState: createRes,
        //update later
        movingState: createRes,
      },
      actions: {
        createTask: onCreateTask,
        moveTask: onCreateTask,
      },
    }),
    //add move stuff
    [users, tasks, projectId, sprintId, columns, createRes, onCreateTask]
  );

  return (
    <SprintBoardContext.Provider value={value}>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className="relative w-full m-auto" ref={ref}>
          {dimensions.width ? (
            <ScrollArea
              style={{
                width: `${dimensions.width}px`,
              }}
              className="whitespace-nowrap min-h-[70vh]"
            >
              <div className="relative flex gap-4 w-max">
                {columns.map((c) => (
                  <div
                    // key={i}
                    key={c.id}
                    className="py-2 whitespace-normal w-80"
                  >
                    <SprintBoardColumn column={c} tasks={populatedTasks} />
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          ) : (
            <></>
          )}
        </div>

        {createPortal(
          <DragOverlay>{activeTask ? <p>hELLO</p> : <></>}</DragOverlay>,
          document.body
        )}
      </DndContext>

      <code>
        <pre className="text-xs whitespace-break-spaces">
          {JSON.stringify(tasks, null, 2)}
        </pre>
      </code>
    </SprintBoardContext.Provider>
  );
};

const SprintBoard = memo(Board);

export default SprintBoard;
