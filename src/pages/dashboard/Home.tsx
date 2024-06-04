import { useState } from "react";
import AppHeaderNav from "@/components/AppHeaderNav";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { cn } from "@/lib/utils";
import { CaretDownIcon } from "@radix-ui/react-icons";
import { endOfDay } from "date-fns/endOfDay";
import { addDays } from "date-fns/addDays";
import { useGetUserTasksProgressQuery } from "@/services/dashboard";

addDays;

const today = endOfDay(new Date());

const Home = () => {
  const [endDate, setEndDate] = useState(addDays(today, -7));
  const [range, setRange] = useState(`7`);

  const { data: tasksData } = useGetUserTasksProgressQuery({
    endDate: endDate.toISOString(),
    startDate: today.toISOString(),
    prevRangeEndDate: addDays(endDate, -+range).toISOString(),
  });

  const onRangeUpdate = (val: string) => {
    if (+val) {
      setEndDate(addDays(today, -+val));
      setRange(val);
    }
  };

  return (
    <div>
      <AppHeaderNav>
        <h6 className="font-medium text-c5-300 ">Dashboard</h6>
      </AppHeaderNav>

      <div className="p-4 space-y-4">
        <div className="space-x-2 btwn">
          <h3>Overview</h3>

          <Select onValueChange={onRangeUpdate} value={range} defaultValue="b">
            <SelectTrigger
              renderCaret={() => <CaretDownIcon className="ml-1.5" />}
              className={cn(
                "rounded-full w-unset min-w-[150px] text-sm px-4 font-medium bg-white",
                {}
              )}
            >
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={"7"}>Last 7 days</SelectItem>
                <SelectItem value={"30"}>Last 30 days</SelectItem>
                <SelectItem value={"90"}>Last 90 days</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2 my-2 md:grid-cols-2 md:gap-4 xl:grid-cols-4">
          <div className="p-1 border center min-h-[100px]">Tasks progress</div>
          <div className="p-1 border center min-h-[100px]">Task priority</div>
          <div className="p-1 border center min-h-[100px]">Active projects</div>
          <div className="p-1 border center min-h-[100px]">Members</div>
        </div>

        <div className="grid gap-2 grid-cols-[minmax(0,1fr)_25%]">
          <div className="space-y-5=3">
            <div className="min-h-[30vh]">table</div>
            <div className="min-h-[30vh]">chart section</div>
          </div>
          <div>compasses</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
