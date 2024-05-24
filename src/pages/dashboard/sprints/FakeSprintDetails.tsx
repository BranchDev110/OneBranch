import { useMemo, useState } from "react";

import { Input } from "@/ui/input";
import {
  MagnifyingGlassIcon,
  PlusCircledIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import groupBy from "lodash/groupBy";

import AppHeaderNav from "@/components/AppHeaderNav";

import { Progress } from "@/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";

import CreateEditTaskModal from "@/components/Tasks/CreateEditTaskModal";

import projects from "@/assets/dummyData/projects.json";
import _tasks from "@/assets/dummyData/tasks.json";

import a from "@/assets/a.jpg";
import b from "@/assets/b.jpg";
import c from "@/assets/c.jpg";
import { Button } from "@/ui/button";
import TaskCard from "@/components/Tasks/TaskCard";
import SortIcon from "@/icons/SortIcon";

const avatars = [
  { id: "1", src: b, name: "A" },
  { id: "2", src: c, name: "B" },
  { id: "3", src: "", name: "C" },
];

const FakeSprintDetails = () => {
  const id = "78e6a2bf-c9cb-420b-967d-863d553021a3";
  const [tasks] = useState(_tasks);

  const project = projects.find((p) => p.id === id);
  const val = 62;

  const rem = avatars.length - 2;
  const columns = ["today", "upcoming", "completed"];
  const keyMap: Record<string, string> = {
    today: "Today's Tasks",
    upcoming: "Upcoming Tasks",
    completed: "completed Tasks",
  };

  const groupedTasks = useMemo(() => {
    const grouped = groupBy(tasks, "column_id");

    return grouped;
  }, [tasks]);

  if (!project?.id) {
    return <></>;
  }

  return (
    <div className="">
      <AppHeaderNav className="[&_.children]:basis-1/2">
        <div className="space-x-[10%] btwn">
          <h6 className="font-medium text-c5-300 ">Details</h6>

          <div className="relative flex-1">
            <i className="absolute -translate-y-1/2 left-2 top-1/2">
              <MagnifyingGlassIcon />
            </i>
            <Input
              placeholder="Search...."
              className="block w-full pl-7 bg-c5-50 rounded-xl"
              type="search"
            />
          </div>
        </div>
      </AppHeaderNav>

      <div className="p-4 bg-white border-b py-7 btwn">
        <div className="basis-1/2 grid items-center gap-2 grid-cols-[40px_minmax(0,1fr)]">
          <div className="overflow-hidden rounded-full aspect-square bg-c5-200 center">
            <img
              alt=""
              src={a}
              className="block object-cover object-center w-full h-full"
            />
          </div>
          <div>
            <h5 className="font-bold">{project.name}</h5>
            <div className="space-x-1 btwn">
              <Progress
                className="bg-c5-50 [&_.bg-primary]:bg-c2-200"
                value={val}
              />
              <p className="text-xs basis-1/4 text-c1-100">{val}% Complete</p>
            </div>
          </div>
        </div>

        <div className="space-x-2 end">
          <div className="-space-x-3 btwn">
            {avatars.slice(0, 2).map((a) => (
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
      </div>

      <div className="p-8 py-3 ">
        <div className="space-x-3 start">
          <CreateEditTaskModal projectId="x" />
          <div className="flex-1 p-4 bg-white rounded-xl min-h-12 btwn spaxe-x-2">
            <div className="space-x-2 text-sm font-semibold start ">
              <button type="button" className="relative px-3 py-1 text-primary">
                All
                <span className="absolute top-0 inline-block w-1 -translate-x-1/2 -translate-y-1/2 rounded-full left-1/2 aspect-square bg-primary"></span>
              </button>
              {["Ongoing", "To Do", "Done"].map((c) => (
                <button
                  key={c}
                  type="button"
                  className="relative px-3 py-1 text-c5-300"
                >
                  {c}
                </button>
              ))}
            </div>

            <p className="space-x-1 start text-c5-300">
              <span> Time</span>
              <i>
                <SortIcon className="w-6 h-6" />
              </i>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 py-6">
          {columns.map((c) => (
            <div key={c} className="relative isolate bg-c5">
              <div className="absolute top-0 w-[97%] mx-[1.5%] h-2 -translate-y-1/2 rounded-t-full bg-c2 -z-10"></div>

              <div className="rounded-t-xl bg-c5">
                <div className="p-4 space-x-2 btwn">
                  <div className="space-x-3 start">
                    <p className="text-lg font-bold">{keyMap[c]}</p>
                    <span className="w-8 p-1 text-sm font-bold text-center rounded-full bg-c5-400/30 aspect-square center text-c5-300">
                      {groupedTasks[c].length}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="text-lg rounded-full w-7 bg-primary text-c5 center aspect-square"
                  >
                    <PlusIcon className="stroke-2" />
                  </button>
                </div>
                <section className="space-y-2">
                  {groupedTasks[c].map((t) => (
                    <TaskCard {...t} key={t.id} />
                  ))}
                </section>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FakeSprintDetails;
