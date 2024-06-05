import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
} from "@tanstack/react-table";
import { useMemo } from "react";
import CircularProgressBar from "./CircularProgressBar";
import { cn } from "@/lib/utils";
import { format } from "date-fns/format";
import { isValid } from "date-fns/isValid";
import { useNavigate } from "react-router-dom";

interface Props {
  projects: any[];
}

const columnHelper = createColumnHelper<any>();

const DBProjectsTable = ({ projects = [] }: Props) => {
  const navigate = useNavigate();

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
        cell: (props: any) =>
          isValid(new Date(props.row.original.dueDate))
            ? format(new Date(props.row.original.dueDate), "LLL dd, yyyy")
            : "-",
      },
      columnHelper.display({
        id: "status",
        header: "Status",
        cell: (props) => {
          const data = props.row.original;
          switch (true) {
            //add more checks for at risk projects

            case data.currentPoints === data.totalPoints:
              return (
                <span className="inline-block p-1 px-2 text-xs font-medium rounded-full text-c2 bg-c2/20">
                  Completed
                </span>
              );

            case data.currentPoints > 0 &&
              data.currentPoints < data.totalPoints:
              return (
                <span className="inline-block p-1 px-2 text-xs font-medium rounded-full text-c3 bg-c3/20">
                  In Progress
                </span>
              );

            default:
              return (
                <span className="inline-block p-1 px-2 text-xs font-medium rounded-full text-c4 bg-c4/20">
                  Not Started
                </span>
              );
          }
        },
      }),
      {
        accessorKey: "currentPoints",
        header: "Progress",
        cell: (props: any) => {
          const data = props.row.original;
          let className = "stroke-c2";

          if (data.currentPoints > 0 && data.currentPoints < data.totalPoints) {
            className = "stroke-c3";
          }

          return (
            <div className="w-8 h-8">
              <CircularProgressBar
                total={data.totalPoints}
                value={data.currentPoints}
                guageClass={cn(className)}
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
  });

  return (
    <div className="">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className="hover:bg-inherit" key={headerGroup.id}>
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
                onClick={() => {
                  navigate(`/`);

                  // navigate(`/projects/${row.original.id}`);
                }}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DBProjectsTable;
