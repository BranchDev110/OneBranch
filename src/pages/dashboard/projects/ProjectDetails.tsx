import { useMemo, useState } from "react";

import { NavLink, useParams } from "react-router-dom";
import {
  CalendarIcon,
  ClockIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";

import { serializeError } from "serialize-error";
import { format } from "date-fns/format";
import { isValid } from "date-fns/isValid";

import {
  useGetProjectColumnsQuery,
  useGetProjectQuery,
} from "@/services/projects";
import { useGetUsersInProjectQuery } from "@/services/users";

import AppHeaderNav from "@/components/AppHeaderNav";
import CaseRender from "@/components/CaseRender";
import LoadingComponent from "@/components/LoadingComponent";
import ErrorComponent from "@/components/ErrorComponent";

import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import TeamIcon from "@/icons/TeamIcon";

import useLoggedInUser from "@/hooks/useLoggedInUser";
import { useGetSprintsInProjectQuery } from "@/services/sprints";
import EditProjectModal from "@/components/Projects/EditProjectModal";
import { Project } from "@/types/project.types";
import CreateProjectSprintModal from "@/components/Projects/CreateProjectSprintModal";
import SprintsContainer from "@/components/Sprints/SprintsContainer";

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useLoggedInUser();
  const [open, setOpen] = useState(false);

  const {
    data: project,
    isLoading: projectLoading,
    isSuccess: projectSuccess,
    isError: projectError,
    error: projError,
  } = useGetProjectQuery(id as string, { skip: !id });
  const {
    data: columns = [],
    isLoading: colLoading,
    isSuccess: colSuccess,
    isError: colIsError,
    error: colError,
  } = useGetProjectColumnsQuery(id as string, {
    skip: !id,
  });

  const {
    data: team = [],
    isLoading: teamLoading,
    isSuccess: teamSuccess,
    isError: teamIsError,
    error: teamError,
  } = useGetUsersInProjectQuery(project?.members as string[], {
    skip: !project?.members?.length,
  });

  const {
    data: sprints = [],
    isLoading: sprintsLoading,
    isSuccess: sprintsSuccess,
    isError: sprintsIsError,
    error: sprintsError,
  } = useGetSprintsInProjectQuery(id as string, { skip: !id });
  // console.log({ columns, project, team });

  const isLoading =
    colLoading || projectLoading || teamLoading || sprintsLoading;
  const isSuccess =
    colSuccess && projectSuccess && teamSuccess && sprintsSuccess;
  const isError = colIsError || projectError || teamIsError || sprintsIsError;

  const error = serializeError({
    team: teamError,
    projectDetails: projError,
    projectColumns: colError,
    sprintDetails: sprintsError,
  });

  const orderedColumns = useMemo(() => {
    if (project?.columns?.length && columns?.length) {
      return [...columns].sort((a, b) => {
        return project.columns.indexOf(a.id) - project.columns.indexOf(b.id);
      });
    }

    return [];
  }, [columns, project?.columns]);

  return (
    <div className="">
      <AppHeaderNav>
        <NavLink className={"font-medium text-c5-300"} to={"/projects"}>
          Back
        </NavLink>
      </AppHeaderNav>

      <div className="p-4">
        <LoadingComponent show={isLoading} />

        <ErrorComponent
          show={isError}
          message={
            <code className="block w-full">
              <pre className="max-w-full text-sm break-all whitespace-break-spaces ">
                {JSON.stringify(error, null, 2)}
              </pre>
            </code>
          }
        />
      </div>

      <CaseRender condition={isSuccess}>
        <div className="grid gap-2 grid-cols-[minmax(0,1fr)_minmax(50px,0.35fr)] p-4">
          <div className="px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                {project?.imageUrl ? (
                  <img
                    alt="Project Avatar"
                    className="object-cover object-center w-16 rounded-full aspect-square"
                    height={64}
                    src={project?.imageUrl}
                  />
                ) : (
                  <></>
                )}
                <h1 className="text-2xl font-bold">{project?.name}</h1>
              </div>

              <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger
                  className="p-2 space-x-1 font-semibold btwn"
                  aria-label="Dropdown Menu"
                >
                  <span>Actions</span>
                  <DotsHorizontalIcon />
                </DropdownMenuTrigger>

                <DropdownMenuContent className="">
                  <EditProjectModal
                    project={project as Project}
                    columns={columns}
                    orderedColumns={orderedColumns}
                    user={user}
                    closeModal={setOpen}
                  />
                  <DropdownMenuItem>Create Task</DropdownMenuItem>
                  <CreateProjectSprintModal
                    user={user}
                    project={project as Project}
                  />
                  <DropdownMenuItem>Set Active Sprint</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="grid gap-6">
              <div>
                <h2 className="mb-2 text-lg font-semibold">Project Details</h2>
                <div className="grid gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="text-gray-500 " />
                    <span className="text-gray-500 ">
                      Started on{" "}
                      {isValid(new Date(project?.startDate as string))
                        ? format(
                            new Date(project?.startDate as string),
                            "LLLL dd, yyyy"
                          )
                        : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="text-gray-500 " />
                    <span className="text-gray-500 ">
                      Ends on{" "}
                      {isValid(new Date(project?.endDate as string))
                        ? format(
                            new Date(project?.endDate as string),
                            "LLLL dd, yyyy"
                          )
                        : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TeamIcon className="text-gray-500 " />
                    <span className="text-gray-500 ">
                      {team?.length} team member{team?.length > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="mb-2 text-lg font-semibold">
                  Project Description
                </h2>
                <div className="text-sm text-gray-500 whitespace-pre-line ">
                  <p>{project?.description}</p>
                </div>
              </div>

              <div>
                <h2 className="mb-2 text-lg font-semibold">Project Columns</h2>

                <ol className="max-w-md space-y-1 text-gray-500 list-decimal list-inside">
                  {orderedColumns.map((col) => (
                    <li key={col.id}>{col.name}</li>
                  ))}
                </ol>
              </div>

              <div>
                <h2 className="mb-2 text-lg font-semibold">Project Sprints</h2>

                <SprintsContainer
                  sprints={sprints}
                  defaultProject={{
                    id: project?.id as string,
                    name: project?.name as string,
                  }}
                />
              </div>

              <div>
                <h2 className="mb-2 text-lg font-semibold">Project Tasks</h2>

                <h3 className="text-center ">COMING SOON</h3>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="sticky top-0 p-4 rounded-lg bg-c2-100/50">
              <h2 className="mb-4 text-lg font-semibold">Project Team</h2>

              <div className="grid gap-4">
                {team.map((t) => (
                  <div key={t.id} className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage alt="Sofia Davis" src={t.avatarUrl} />
                      <AvatarFallback>{t.name[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{t.name}</p>
                      <p className="text-sm text-gray-500 capitalize ">
                        {t.role?.toLowerCase()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CaseRender>
    </div>
  );
};

export default ProjectDetails;
