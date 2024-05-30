import {
  memo,
  useRef,
  useState,
  createContext,
  useMemo,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import groupBy from "lodash/groupBy";

import usePopulateTasksWithUsers from "@/hooks/usePopulateTasksWithUsers";
import { AppUserProfile } from "@/types/user.types";
import { Task, TaskWithPopulatedUsers, MoveTaskArgs } from "@/types/task.types";
import { ProjectColumn } from "@/types/project.types";
import { useMoveTaskMutation } from "@/services/tasks";
import { toast } from "sonner";

import {
  DndContext,
  DragEndEvent,
  //   DragOverEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import { ScrollArea, ScrollBar } from "@/ui/scroll-area";
import useMeasure from "@/hooks/useMeasure";
import SprintBoardColumn from "./SprintBoardColumn";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import orderBy from "lodash/orderBy";
import FloatingTask from "./FloatingTask";

interface Props {
  users: AppUserProfile[];
  tasks: Task[];
  columns: ProjectColumn[];
  projectId: string;
  projectName: string;
  sprintId: string;
}

interface BoardState extends Props {}

interface ISprintBoard {
  state: BoardState;
}

export const SprintBoardContext = createContext<ISprintBoard | undefined>(
  undefined
);

interface CustomDragStartEvent extends Omit<DragStartEvent, "active"> {
  active: {
    id: string;
    data: {
      current: {
        task: TaskWithPopulatedUsers;
      };
    };
  };
}

interface CustomDragEndEvent extends Omit<DragEndEvent, "active" | "over"> {
  active: {
    id: string;
    data: {
      current: {
        task: TaskWithPopulatedUsers;
      };
    };
  };
  over: {
    id: string;
    data: {
      current:
        | {
            column: ProjectColumn;
            itemCount: number;
            type: "Column";
          }
        | {
            task: TaskWithPopulatedUsers;
            type: "Task";
          };
    };
  } | null;
}

const Board = ({
  tasks = [],
  users = [],
  projectId,
  sprintId,
  projectName,
  columns = [],
}: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const { populatedTasks = [] } = usePopulateTasksWithUsers({ tasks, users });

  const [moveTask] = useMoveTaskMutation();

  const [activeTask, setActiveTask] = useState<null | TaskWithPopulatedUsers>(
    null
  );

  const onMoveTask = useCallback(
    async (args: MoveTaskArgs) => {
      try {
        toast.dismiss();
        toast.loading("Moving task...");
        await moveTask(args).unwrap();

        toast.dismiss();
        toast.success("Moved task");
      } catch (error: any) {
        toast.dismiss();

        const msg = error?.message || "Unable to move task";
        toast.error(msg);
      }
    },
    [moveTask]
  );

  const handleDragOver = () => {
    // console.log({ event, name: "dragOver" });
  };

  const handleDragStart = (event: CustomDragStartEvent) => {
    // console.log({ event, name: "dragstart" });
    setActiveTask(event.active.data.current.task);
  };

  const handleDragEnd = (event: CustomDragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    // console.log({ event, name: "dragend" });

    if (over?.id && active?.id) {
      //if over new column or at bottom of same column
      if (over?.data.current.type === "Column") {
        const oldCol = active.data.current.task.columnId;
        const newCol = over.id;

        if (oldCol !== newCol) {
          const args: MoveTaskArgs = {
            taskId: active.id,
            columnId: over.id,
            order: over?.data.current.itemCount || 0,
          };

          onMoveTask(args);

          return;
        }
        return;
      }

      //if over task [same col or new col]
      if (over?.data.current.type === "Task") {
        const targetTask = tasks.find((t) => t.id === over.id);
        const task = active.data.current.task;

        if (targetTask?.id) {
          if (targetTask.id !== task.id) {
            const orderedTargetColumnTasks = orderBy(
              tasks.filter((t) => t.columnId === targetTask?.columnId),
              "order"
            );

            const newIndex = orderedTargetColumnTasks.findIndex(
              (item) => item.id === targetTask.id
            );

            let newOrder = orderedTargetColumnTasks.length;

            if (newIndex === 0) {
              //if move to first position
              newOrder = (orderedTargetColumnTasks[0].order || 0) - 1;
            } else if (newIndex === tasks.length - 1) {
              //if move to last position
              newOrder = orderedTargetColumnTasks[tasks.length - 1].order + 1;
            } else {
              //anything position not first or last
              const prevOrder = orderedTargetColumnTasks[newIndex - 1].order;
              const nextOrder = orderedTargetColumnTasks[newIndex].order;
              newOrder = (prevOrder + nextOrder) / 2;
            }

            // console.log({ newIndex, newOrder, orderedTargetColumnTasks });

            onMoveTask({
              taskId: task.id as string,
              columnId: targetTask?.columnId,
              order: newOrder,
            });
          }

          return;
        }
      }
    }
  };

  const { dimensions } = useMeasure({
    ref,
  });

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const value: ISprintBoard = useMemo(
    () => ({
      state: {
        users,
        tasks,
        projectId,
        sprintId,
        columns,
        projectName,
      },
    }),
    [users, tasks, projectId, sprintId, columns, projectName]
  );

  const groupedTasks = useMemo(() => {
    const withColumnIds = populatedTasks.filter((t) => t.columnId);
    const withoutColumnIds = populatedTasks.filter((t) => !t.columnId);

    const grouped = groupBy(withColumnIds, "columnId");

    // console.log({ grouped, columns, withoutColumnIds, withColumnIds });

    //show unclassified tasks in the first column
    if (columns.length && withoutColumnIds.length) {
      grouped[columns[0].id] = grouped[columns[0].id]?.length
        ? grouped[columns[0].id].concat(withoutColumnIds)
        : withoutColumnIds;
    }

    return grouped;
  }, [populatedTasks, columns]);

  //   console.log({ groupedTasks, columns, activeTask });

  return (
    <SprintBoardContext.Provider value={value}>
      <DndContext
        //@ts-expect-error work on ts
        onDragStart={handleDragStart}
        //@ts-expect-error work on ts
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        sensors={sensors}
      >
        <div className="relative w-full ml-0" ref={ref}>
          {dimensions.width ? (
            <ScrollArea
              style={{
                width: `${dimensions.width}px`,
              }}
              className="whitespace-nowrap min-h-[70vh]"
            >
              <div className="relative flex gap-4 w-max">
                {columns.map((c) => (
                  <div key={c.id} className="py-2 whitespace-normal w-80">
                    <SprintBoardColumn column={c} tasks={groupedTasks[c.id]} />
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
            {activeTask ? <FloatingTask task={activeTask} /> : <></>}
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
