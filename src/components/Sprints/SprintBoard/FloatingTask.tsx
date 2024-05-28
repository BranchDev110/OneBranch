import Truncatable from "react-truncatable";
import { TaskWithPopulatedUsers } from "@/types/task.types";
import ImportantIcon from "@/icons/ImportantIcon";
import { format } from "date-fns/format";

interface Props {
  task: TaskWithPopulatedUsers;
}

const FloatingTask = ({ task }: Props) => {
  return (
    <article className="bg-white border rounded-xl grid grid-rows-[50px_minmax(0,1fr)_24px_42px] gap-1 p-4">
      <header className="items-start font-semibold btwn space-x-1.5">
        <ImportantIcon className="w-6 h-6 fill-c1 " />
        <h5 className="flex-1">{task.name}</h5>
      </header>

      <Truncatable
        className="text-xs text-c5-300 min-h-[50px]"
        as="section"
        content={task.description}
      />

      <footer className="pt-3 mt-2 space-y-1 text-sm border-t">
        <p className="font-semibold ">
          <span className="text-c3">Deadline</span>
          <span>: {format(new Date(task.dueDate), "eo LLLL yyyy")}</span>
        </p>{" "}
        <p> {task.assignees.length} assignee(s)</p>
      </footer>
    </article>
  );
};

export default FloatingTask;
