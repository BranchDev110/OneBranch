// import  {useLoggedInUser } from "@/hooks/useLoggedInUser";
import { useState, useMemo, ReactNode } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { TASK_STATUS } from "@/constants/task-status";
import { CaretDownIcon, CheckIcon } from "@radix-ui/react-icons";
import { Button } from "@/ui/button";
import { cn } from "@/lib/utils";
import { matchSorter } from "match-sorter";

interface Props {
  startDate: Date;
  endDate: Date;
  prevRangeEndDate: Date;
  renderChildren: ({ projects }: { projects: any[] }) => ReactNode;
  label: string;
}

const fakeusers = [
  {
    id: 1,
    name: "Filberto Birkhead",
  },
  {
    id: 2,
    name: "Breena Twelves",
  },

  {
    id: 7,
    name: "Ester Soltan",
  },
  {
    id: 8,
    name: "Martynne Juggins",
  },
  {
    id: 9,
    name: "Corey Vater",
  },
  {
    id: 10,
    name: "Caresse Trew",
  },
];

const projects = [
  {
    id: 1,
    name: "Phasellus in felis.",
    totalPoints: 69,
    currentPoints: 0,
    managerName: "Filberto Birkhead",
    dueDate: "2024-07-05T16:39:39.834Z",
  },
  {
    id: 2,
    name: "Cras non velit nec .",
    totalPoints: 77,
    currentPoints: 10,
    managerName: "Ester Soltan",
    dueDate: "2024-07-05T16:39:39.834Z",
  },
  {
    id: 3,
    name: "Morbi ut odio.",
    totalPoints: 36,
    currentPoints: 36,
    managerName: "Filberto Birkhead",
    dueDate: "2024-07-05T16:39:39.834Z",
  },
  {
    id: 4,
    name: "Proin eu mi.",
    totalPoints: 43,
    currentPoints: 43,
    managerName: "Ester Soltan",
    dueDate: "2024-07-05T16:39:39.834Z",
  },
  {
    id: 5,
    name: "Nulla facilisi.",
    totalPoints: 24,
    currentPoints: 3,
    managerName: "Martynne Juggins",
    dueDate: "2024-07-05T16:39:39.834Z",
  },
  {
    id: 6,
    name: "Dapibus at, diam.",
    totalPoints: 91,
    currentPoints: 51,
    managerName: "Caresse Trew",
    dueDate: "2024-07-05T16:39:39.834Z",
  },
  {
    id: 7,
    name: "Mauris ullamcorper nulla.",
    totalPoints: 53,
    currentPoints: 26,
    managerName: "Corey Vater",
    dueDate: "2024-07-05T16:39:39.834Z",
  },
  {
    id: 8,
    name: "Nulla nisl.",
    totalPoints: 150,
    currentPoints: 80,
    managerName: "Ester Soltan",
    dueDate: "2024-07-05T16:39:39.834Z",
  },
  {
    id: 9,
    name: "Donec posuere .",
    totalPoints: 70,
    currentPoints: 0,
    managerName: "Breena Twelves",
    dueDate: "2024-07-05T16:39:39.834Z",
  },
  {
    id: 10,
    name: "Vivamus pellentesque.",
    totalPoints: 60,
    currentPoints: 59,
    managerName: "Breena Twelves",
    dueDate: "2024-07-05T16:39:39.834Z",
  },
];

const DashboardProjectsProvider = ({
  label,
  // endDate,
  // prevRangeEndDate,
  // startDate,
  renderChildren,
}: Props) => {
  // const { user } = useLoggedInUser();
  const [open, setOpen] = useState(false);
  const [manager, setManger] = useState("");
  const [status, setStatus] = useState<TASK_STATUS | "all">("all");

  const handleManagerSelect = (mId: string) => {
    setManger((id) => (id === mId ? "" : mId));
    setOpen(false);
  };

  const handleStatusSelect = (s: TASK_STATUS | "all") => {
    setStatus(s);
  };

  const usersMap = useMemo(
    () =>
      fakeusers.reduce((map, user) => {
        map[user.id] = user;
        return map;
      }, {} as Record<string, any>),
    //replace with users for firebase later
    [fakeusers]
  );

  const filteredProjects = useMemo(
    () => {
      let filteredProjects = matchSorter(
        projects,
        usersMap?.[manager]?.name || "",
        {
          keys: ["managerName"],
          threshold: matchSorter.rankings.CONTAINS,
        }
      );

      switch (status) {
        case TASK_STATUS.DONE:
          filteredProjects = filteredProjects.filter(
            (p) => p.currentPoints === p.totalPoints
          );
          break;

        case TASK_STATUS.ONGOING:
          filteredProjects = filteredProjects.filter(
            (p) => p.currentPoints > 0 && p.currentPoints < p.totalPoints
          );
          break;

        case TASK_STATUS.TODO:
          filteredProjects = filteredProjects.filter(
            (p) => p.currentPoints === 0
          );
          break;

        default:
          break;
      }

      return filteredProjects;
    },

    //replace with data from server later
    [manager, status, projects, usersMap]
  );

  return (
    <div className="space-y-2 min-h-52">
      <header className="flex-wrap gap-2 md:flex-nowrap btwn">
        <h3>{label}</h3>
        <div className="flex-wrap gap-2 md:flex-nowrap end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              asChild
              className="text-sm font-normal !text-black !bg-white border-transparent rounded-full"
            >
              <Button className="space-x-1 w-unset">
                <span>{usersMap?.[manager]?.name || "Project Manager"}</span>
                <CaretDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder="Search manager..." />
                <CommandEmpty>No manager found.</CommandEmpty>
                <CommandGroup>
                  <CommandList>
                    {fakeusers.map((u) => (
                      <CommandItem
                        key={u.id}
                        value={`${u.id}`}
                        onSelect={handleManagerSelect}
                      >
                        <CheckIcon
                          className={cn({
                            "opacity-0": manager !== `${u.id}`,
                            "opacity-100": manager === `${u.id}`,
                          })}
                        />
                        {u.name}
                      </CommandItem>
                    ))}
                  </CommandList>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          <Select value={status} onValueChange={handleStatusSelect}>
            <SelectTrigger
              className="bg-white border-transparent rounded-full pl"
              renderCaret={() => <CaretDownIcon className="ml-1" />}
            >
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={"all"}>Status</SelectItem>
                <SelectItem value={TASK_STATUS.TODO}>
                  {TASK_STATUS.TODO}
                </SelectItem>
                <SelectItem value={TASK_STATUS.ONGOING}>
                  {TASK_STATUS.ONGOING}
                </SelectItem>
                <SelectItem value={TASK_STATUS.DONE}>
                  {TASK_STATUS.DONE}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </header>
      <div>{renderChildren({ projects: filteredProjects })}</div>
    </div>
  );
};

export default DashboardProjectsProvider;
