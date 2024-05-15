import { Task } from "@/types/task.types";
import {} from "react";
import Truncatable from "react-truncatable";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";

import { format } from "date-fns/format";

import a from "@/assets/a.jpg";
import b from "@/assets/b.jpg";
import c from "@/assets/c.jpg";
import { Button } from "@/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";

const avatars = [
  { id: "1", src: b, name: "A" },
  { id: "2", src: c, name: "B" },
  { id: "3", src: a, name: "C" },
];

interface Props extends Task {}

const TaskCard = ({ description, name, due_date }: Props) => {
  const rem = 2;

  return (
    <article className="bg-white border rounded-xl grid grid-rows-[50px_minmax(0,1fr)_24px_42px] gap-1 p-4">
      <header className="font-semibold btwn">
        <h5>{name}</h5>
      </header>
      <Truncatable
        className="text-xs text-c5-300 min-h-[50px]"
        as="section"
        content={description}
      />
      <p className="text-xs font-semibold">
        <span className="text-c3">Deadline</span>
        <span>: {format(new Date(due_date), "eo LLLL yyyy")}</span>
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
      </footer>
    </article>
  );
};

export default TaskCard;
