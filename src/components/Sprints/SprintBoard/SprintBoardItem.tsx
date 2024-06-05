import { cn } from "@/lib/utils";
import { TaskWithPopulatedUsers } from "@/types/task.types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  task: TaskWithPopulatedUsers;
}

const SprintBoardItem = ({ children, task }: Props) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn("transition-opacity", {
        ["opacity-50"]: isDragging,
      })}
    >
      {children}
    </div>
  );
};

export default SprintBoardItem;
