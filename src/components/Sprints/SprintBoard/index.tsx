import {
  memo,
  useRef,
  useState,
  createContext,
  useMemo,
  useCallback,
} from "react";
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

  const onCreateTask = useCallback(() => {}, []);

  const handleDragOver = (event: DragOverEvent) => {
    console.log({ event });
  };
  const handleDragStart = (event: DragStartEvent) => {
    console.log({ event });

    setActiveTask(event.active.data.current.task);
  };
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    console.log({ event });
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
          <DragOverlay>
            {activeTask ? (
              <div className="z-10 p-4 bg-white w-80">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Modi
                quas, illo cupiditate minima blanditiis officia sunt adipisci
                doloribus, error quaerat cumque dignissimos eum nesciunt
                accusantium nulla aut, sit dicta tenetur?
              </div>
            ) : (
              <></>
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>

      {/* <code>
        <pre className="text-xs whitespace-break-spaces">
          {JSON.stringify(tasks, null, 2)}
        </pre>
      </code> */}
    </SprintBoardContext.Provider>
  );
};

const SprintBoard = memo(Board);

export default SprintBoard;
