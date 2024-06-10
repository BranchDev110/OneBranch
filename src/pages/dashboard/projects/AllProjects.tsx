import React from "react";
import AppHeaderNav from "@/components/AppHeaderNav";
import useLoggedInUser from "@/hooks/useLoggedInUser";
import { useGetUsersProjectsQuery } from "@/services/projects";
import { Button } from "@/ui/button";
import { useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Project } from "@/types/project.types";
import { format } from "date-fns/format";

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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Input } from "@/ui/input";
import { cn } from "@/lib/utils";
import { ROLES } from "@/constants/roles";

import { round } from "@/lib/round";

const columnHelper = createColumnHelper<Project>();

const sortByEndDate = (rowA: Row<Project>, rowB: Row<Project>) => {
  const endA = rowA.original.endDate;
  const endB = rowB.original.endDate;

  return new Date(endA).getTime() - new Date(endB).getTime();
};

const sortByProgress = (rowA: Row<Project>, rowB: Row<Project>) => {
  const progA =
    (100 * rowA.original.currentPoints || 0) / (rowA.original.totalPoints || 1);

  const progB =
    (100 * rowB.original.currentPoints || 0) / (rowB.original.totalPoints || 1);

  // console.log({ progA, progB });

  return progA - progB;
};

const AllProjects = () => {
  const { user } = useLoggedInUser();

  const navigate = useNavigate();

  const { data: projects = [] } = useGetUsersProjectsQuery(user!.id as string, {
    skip: !user?.id,
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              className="w-full start"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Project name
              <CaretSortIcon className="w-4 h-4 ml-2" />
            </Button>
          );
        },
      },
      {
        accessorKey: "endDate",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              className="w-full start"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Due on
              <CaretSortIcon className="w-4 h-4 ml-2" />
            </Button>
          );
        },
        cell: ({ row }) =>
          format(new Date(row.original.endDate), "eo LLLL yyyy"),
        sortingFn: sortByEndDate,
      },
      columnHelper.accessor("currentPoints", {
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              className="w-full start"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Progress
              <CaretSortIcon className="w-4 h-4 ml-2" />
            </Button>
          );
        },
        sortingFn: sortByProgress,
        cell: ({ row }) =>
          `${round(
            (100 * row.original.currentPoints || 0) /
              (row.original.totalPoints || 1),
            2
          )}%`,
      }),
      {
        accessorKey: "imageUrl",
        header: "Cover",
        cell: ({ row }) => {
          if (!row.original.imageUrl) {
            return <p className="text-center min-h-16 center">-</p>;
          }

          return (
            <div className="relative w-12 mx-auto overflow-hidden border-2 rounded-full aspect-square border-primary">
              <img
                className="absolute object-cover object-center w-full h-full"
                src={row.original.imageUrl}
              />
            </div>
          );
        },
      },
    ],
    []
  );
  const table = useReactTable({
    data: projects,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const handleClick = (id: string) => () => {
    navigate(`/projects/${id}`);
  };

  return (
    <div>
      <AppHeaderNav>
        <h6 className="font-medium text-c5-300 ">All Projects</h6>
      </AppHeaderNav>

      <div className="p-4">
        <div className="flex-col gap-4 my-3 start sm:flex-row sm:btwn">
          <h1 className="text-xl font-bold">
            {projects.length} project{projects.length > 1 ? "s" : ""}
          </h1>
          <Button asChild>
            <NavLink
              className={cn("", {
                ["pointer-events-none opacity-45 cursor-not-allowed"]:
                  user?.role !== ROLES.ADMIN,
              })}
              to="/projects/new"
            >
              + New Project
            </NavLink>
          </Button>
        </div>

        <div className="max-w-full">
          <div className="py-4 end">
            <Input
              placeholder="Search..."
              type="search"
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          </div>
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
                      onClick={handleClick(row.original.id)}
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
        </div>
      </div>
    </div>
  );
};

export default AllProjects;
