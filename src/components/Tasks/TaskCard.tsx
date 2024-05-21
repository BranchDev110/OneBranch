import { useState } from "react";

import { Task } from "@/types/task.types";
import Truncatable from "react-truncatable";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { format } from "date-fns/format";
import { cn } from "@/lib/utils";
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

import a from "@/assets/a.jpg";
import b from "@/assets/b.jpg";
import c from "@/assets/c.jpg";

import ChatIcon from "@/icons/ChatIcon";
import AttachmentIcon from "@/icons/AttachmentIcon";
import ImportantIcon from "@/icons/ImportantIcon";

import { TASK_MARKER_ClASSES, TASK_STATUS_ClASSES } from "@/constants/colors";

import { TASK_STATUS } from "@/constants/task-status";

const avatars = [
  { id: "1", src: b, name: "A" },
  { id: "2", src: c, name: "B" },
  { id: "3", src: a, name: "C" },
];

interface Props extends Task {}

const TaskCard = ({ description, name, dueDate, status }: Props) => {
  const [val, setVal] = useState(status);

  const rem = 2;

  return (
    <article className="bg-white border rounded-xl grid grid-rows-[50px_minmax(0,1fr)_24px_42px] gap-1 p-4">
      <header className="items-start font-semibold btwn space-x-1.5">
        <ImportantIcon
          className={cn("w-6 h-6", {
            [TASK_MARKER_ClASSES.Done]:
              val === "completed" || TASK_STATUS.DONE === val,
            [TASK_MARKER_ClASSES.Ongoing]:
              val === "today" || TASK_STATUS.ONGOING === val,
            [TASK_MARKER_ClASSES["To Do"]]:
              val === "upcoming" || TASK_STATUS.TODO === val,
          })}
        />
        <h5 className="flex-1">{name}</h5>

        <Select onValueChange={setVal} value={val}>
          <SelectTrigger
            className={cn("rounded-full w-unset", {
              [TASK_STATUS_ClASSES.Done]:
                val === "completed" || TASK_STATUS.DONE === val,
              [TASK_STATUS_ClASSES.Ongoing]:
                val === "today" || TASK_STATUS.ONGOING === val,
              [TASK_STATUS_ClASSES["To Do"]]:
                val === "upcoming" || TASK_STATUS.TODO === val,
            })}
          >
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="upcoming">To Do</SelectItem>
              <SelectItem value="today">Ongoing</SelectItem>
              <SelectItem value="completed">Done</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </header>
      <Truncatable
        className="text-xs text-c5-300 min-h-[50px]"
        as="section"
        content={description}
      />
      <p className="text-xs font-semibold">
        <span className="text-c3">Deadline</span>
        <span>: {format(new Date(dueDate), "eo LLLL yyyy")}</span>
      </p>
      <footer className="btwn">
        <div className="start">
          <div className="-space-x-3 btwn">
            {avatars.map((a) => (
              <Avatar className="border-2 border-white" key={a.id}>
                <AvatarImage src={a.src} alt={a.name} />
                <AvatarFallback>{a.name[0]}</AvatarFallback>
              </Avatar>
            ))}
            {rem > 0 ? (
              <div className="z-10 w-10 border-2 border-white rounded-full aspect-square center bg-muted">
                +{rem}
              </div>
            ) : (
              <></>
            )}
          </div>
          <Button className="text-c5-400" variant="ghost" size={"icon"}>
            <PlusCircledIcon className="w-7 h-7" />
          </Button>
        </div>

        <div className="space-x-2 text-xs end">
          <button
            type="button"
            className="space-x-0.5 font-bold text-center end text-c5-400"
          >
            <AttachmentIcon className="w-6 h-6" />
            <span>2</span>
          </button>

          <button
            type="button"
            className="space-x-0.5 font-bold text-center end text-c5-400"
          >
            <ChatIcon className="w-6 h-6" />
            <span>2</span>
          </button>
        </div>
      </footer>
    </article>
  );
};

export default TaskCard;
