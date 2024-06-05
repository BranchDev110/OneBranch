import { useState, useMemo } from "react";
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

import { useGetUserTasksProgressQuery } from "@/services/dashboard";
import StatCard from "@/components/Dashboard/StatCard";
import DBTaskProgressIcon from "@/icons/DBTaskProgressIcon";
import BriefCaseIcon from "@/icons/BriefCaseIcon";
import UserIcon from "@/icons/UserIcon";
import CircularProgressBar from "@/components/Dashboard/CircularProgressBar";
import DashboardProjectsProvider from "@/components/Dashboard/DashboardProjectsProvider";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
  ColumnFiltersState,
  Row,
  createColumnHelper,
} from "@tanstack/react-table";

const projects = [
  {
    id: 1,
    name: "Phasellus in felis.",
    totalPoints: 69,
    currentPoints: 35,
    managerName: "Gordie Alwood",
    dueDate: "29-Sep-2022",
  },
  {
    id: 2,
    name: "Cras non velit nec .",
    totalPoints: 77,
    currentPoints: 10,
    managerName: "Ellswerth D'Elias",
    dueDate: "21-Jul-2022",
  },
  {
    id: 3,
    name: "Morbi ut odio.",
    totalPoints: 36,
    currentPoints: 36,
    managerName: "Micheline Willmott",
    dueDate: "02-Jun-2022",
  },
  {
    id: 4,
    name: "Proin eu mi.",
    totalPoints: 43,
    currentPoints: 2,
    managerName: "Marguerite Dalton",
    dueDate: "19-Dec-2022",
  },
  {
    id: 5,
    name: "Nulla facilisi.",
    totalPoints: 24,
    currentPoints: 3,
    managerName: "Allie Fitzsimmons",
    dueDate: "12-Nov-2022",
  },
  {
    id: 6,
    name: "Dapibus at, diam.",
    totalPoints: 91,
    currentPoints: 51,
    managerName: "Minnie France",
    dueDate: "28-Nov-2022",
  },
  {
    id: 7,
    name: "Mauris ullamcorper nulla.",
    totalPoints: 53,
    currentPoints: 26,
    managerName: "Berti Suggett",
    dueDate: "15-Jul-2022",
  },
  {
    id: 8,
    name: "Nulla nisl.",
    totalPoints: 150,
    currentPoints: 80,
    managerName: "Riannon Cullabine",
    dueDate: "28-Aug-2022",
  },
  {
    id: 9,
    name: "Donec posuere .",
    totalPoints: 70,
    currentPoints: 39,
    managerName: "Toddy Standingford",
    dueDate: "27-Jan-2022",
  },
  {
    id: 10,
    name: "Vivamus pellentesque.",
    totalPoints: 60,
    currentPoints: 59,
    managerName: "Lynn Enrique",
    dueDate: "08-Dec-2022",
  },
];

const columnHelper = createColumnHelper<any>();

const today = endOfDay(new Date());

const phrase: Record<string, string> = {
  7: "from last week",
  30: "from last month",
  90: "from last 3 months",
};

const Home = () => {
  const [endDate, setEndDate] = useState(addDays(today, -7));
  const [range, setRange] = useState(`7`);

  const { data: tasksData } = useGetUserTasksProgressQuery({
    endDate: startOfDay(endDate).toISOString(),
    startDate: today.toISOString(),
    prevRangeEndDate: startOfDay(addDays(endDate, -+range)).toISOString(),
  });

  const onRangeUpdate = (val: string) => {
    if (+val) {
      setEndDate(addDays(today, -+val));
      setRange(val);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "managerName",
        header: "Project Manager",
      },
      {
        accessorKey: "dueDate",
        header: "Due Date",
      },
      columnHelper.display({
        id: "status",
        header: "Status",
        cell: (props) => {
          // console.log(props);
          return "In progress";
        },
      }),
      {
        accessorKey: "currentPoints",
        header: "Progress",
        cell: (props: any) => {
          const data = props.row.original;
          return (
            <div className="w-8 h-8">
              <CircularProgressBar
                total={data.totalPoints}
                value={data.currentPoints}
                guageClass={cn("stroke-c2")}
              />
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    columns,
    data: projects,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

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

        <div className="grid gap-2 grid-cols-[minmax(0,1fr)_25%]">
          <div className="space-y-5 ">
            <div className="min-h-[30vh]">
              <DashboardProjectsProvider
                startDate={today}
                endDate={endDate}
                label="Project summary"
                prevRangeEndDate={startOfDay(addDays(endDate, -+range))}
                renderChildren={({}) => (
                  <div className="">
                    <Table>
                      <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                          <TableRow
                            className="hover:bg-inherit"
                            key={headerGroup.id}
                          >
                            {headerGroup.headers.map((header) => {
                              return (
                                <TableHead key={header.id}>
                                  {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                      )}
                                </TableHead>
                              );
                            })}
                          </TableRow>
                        ))}
                      </TableHeader>
                      <TableBody>
                        {table.getRowModel().rows?.length ? (
                          table.getRowModel().rows.map((row) => (
                            <TableRow
                              key={row.id}
                              className="cursor-pointer"
                              data-state={row.getIsSelected() && "selected"}
                            >
                              {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={columns.length}
                              className="h-24 text-center"
                            >
                              No results.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              />

              <DashboardProjectsProvider
                startDate={today}
                endDate={endDate}
                label="Project workload"
                prevRangeEndDate={startOfDay(addDays(endDate, -+range))}
                renderChildren={({ projects }) => (
                  <div>
                    <p>projects chart</p>
                  </div>
                )}
              />

              {/* <div className="w-8 h-8">
                <CircularProgressBar
                  total={100}
                  value={75}
                  guageClass={cn("stroke-c2", {})}
                />
              </div>

              <CircularProgressBar
                total={100}
                value={25}
                guageClass={cn("stroke-c2", {})}
              /> */}
            </div>
            <div className="min-h-[30vh]">chart section</div>
          </div>
          <div>compasses</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
