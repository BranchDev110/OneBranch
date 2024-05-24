import { ProjectColumn } from "@/types/project.types";
import { TaskWithPopulatedUsers } from "@/types/task.types";
import { PlusIcon } from "@radix-ui/react-icons";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSprintBoard } from "./useSprintBoard";
import TaskCard from "@/components/Tasks/TaskCard";
import SprintBoardItem from "./SprintBoardItem";

interface Props {
  tasks: TaskWithPopulatedUsers[];
  column: ProjectColumn;
}

const SprintBoardColumn = ({ tasks = [], column }: Props) => {
  const ctx = useSprintBoard();
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({
      id: column.id,
      data: {
        type: "Column",
        column,
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative isolate min-h-[70vh] bg-c5"
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

        <section {...attributes} {...listeners} className="space-y-2">
          <SortableContext items={tasks}>
            {tasks.map((t) => (
              <SprintBoardItem task={t} key={t.id}>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Modi
                quas, illo cupiditate minima blanditiis officia sunt adipisci
                doloribus, error quaerat cumque dignissimos eum nesciunt
                accusantium nulla aut, sit dicta tenetur?
              </SprintBoardItem>
            ))}
          </SortableContext>
        </section>
      </div>
    </div>
  );
};

export default SprintBoardColumn;
