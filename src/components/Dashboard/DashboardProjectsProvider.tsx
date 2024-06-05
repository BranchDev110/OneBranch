import useLoggedInUser from "@/hooks/useLoggedInUser";
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
import { CaretDownIcon } from "@radix-ui/react-icons";
import { Button } from "@/ui/button";

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
    id: 3,
    name: "Arni Allon",
  },
  {
    id: 4,
    name: "Abel Maplesden",
  },
  {
    id: 5,
    name: "Cam Blose",
  },
  {
    id: 6,
    name: "Alica Cochrane",
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

const DashboardProjectsProvider = ({
  startDate,
  label,
  endDate,
  prevRangeEndDate,
  renderChildren,
}: Props) => {
  const { user } = useLoggedInUser();
  const [open, setOpen] = useState(false);

  const filteredProjects = useMemo(() => {
    return [];
  }, []);

  return (
    <div className="space-y-2 min-h-52">
      <header className="space-x-1 btwn">
        <h3>{label}</h3>
        <div className="space-x-1 end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              asChild
              className="text-sm font-normal !text-black !bg-white border-transparent rounded-full"
            >
              <Button className="space-x-1">
                <span>Project Manager</span>
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
                      <CommandItem key={u.id} value={`${u.id}`}>
                        {u.name}
                      </CommandItem>
                    ))}
                  </CommandList>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          <Select>
            <SelectTrigger
              className="bg-white border-transparent rounded-full pl"
              renderCaret={() => <CaretDownIcon className="ml-1" />}
            >
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
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
