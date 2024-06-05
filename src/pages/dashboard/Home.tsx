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
import { CaretDownIcon, ClockIcon } from "@radix-ui/react-icons";
import { endOfDay } from "date-fns/endOfDay";
import { addDays } from "date-fns/addDays";
import { startOfDay } from "date-fns/startOfDay";

// import { useGetUserTasksProgressQuery } from "@/services/dashboard";
import StatCard from "@/components/Dashboard/StatCard";
import DBTaskProgressIcon from "@/icons/DBTaskProgressIcon";
import BriefCaseIcon from "@/icons/BriefCaseIcon";
import UserIcon from "@/icons/UserIcon";
import DashboardProjectsProvider from "@/components/Dashboard/DashboardProjectsProvider";
import DBProjectsTable from "@/components/Dashboard/DBProjectsTable";
import CompassGuage from "@/components/Dashboard/CompassGuage";

const today = endOfDay(new Date());

const phrase: Record<string, string> = {
  7: "from last week",
  30: "from last month",
  90: "from last 3 months",
};

const Home = () => {
  const [endDate, setEndDate] = useState(addDays(today, -7));
  const [range, setRange] = useState(`7`);

  // const { data: tasksData } = useGetUserTasksProgressQuery({
  //   endDate: startOfDay(endDate).toISOString(),
  //   startDate: today.toISOString(),
  //   prevRangeEndDate: startOfDay(addDays(endDate, -+range)).toISOString(),
  // });

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
          <StatCard
            icon={<DBTaskProgressIcon />}
            phrase={phrase[range]}
            label="Task Progress"
            iconClass="bg-[#D398E7]"
            rate={12}
            isRatio
            pre={100}
            post={50}
          />
          <StatCard
            icon={<BriefCaseIcon />}
            phrase={phrase[range]}
            label="Urgent Tasks"
            iconClass="bg-[#E89271]"
            rate={10}
            val={5}
          />
          <StatCard
            icon={<ClockIcon className="w-5 h-5" />}
            phrase={phrase[range]}
            label="Active Projects"
            iconClass="bg-[#70A1E5]"
            rate={-8}
            val={5}
          />
          <StatCard
            icon={<UserIcon />}
            phrase={phrase[range]}
            label="Members"
            iconClass="bg-[#F0C274]"
            rate={12}
            isRatio
            pre={120}
            post={100}
          />
        </div>

        <div className="grid  md:min-h-[60vh]  gap-3 md:grid-cols-[minmax(0,1fr)_28%] pt-10">
          <div className="space-y-8 ">
            <DashboardProjectsProvider
              startDate={today}
              endDate={endDate}
              label="Project summary"
              prevRangeEndDate={startOfDay(addDays(endDate, -+range))}
              renderChildren={({ projects }) => (
                <DBProjectsTable projects={projects} />
              )}
            />

            <DashboardProjectsProvider
              startDate={today}
              endDate={endDate}
              label="Project workload"
              prevRangeEndDate={startOfDay(addDays(endDate, -+range))}
              renderChildren={() => (
                <div>
                  <p>projects chart</p>
                </div>
              )}
            />
          </div>
          <div className="space-y-2">
            <CompassGuage amount={72} label="Opened Tasks" />
            <CompassGuage amount={72} label="Performance" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
