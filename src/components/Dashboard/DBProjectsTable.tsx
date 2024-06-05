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

interface Props {
  projects: any[];
}

const columnHelper = createColumnHelper<any>();

const DBProjectsTable = ({ projects = [] }: Props) => {
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
        cell: () => {
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
