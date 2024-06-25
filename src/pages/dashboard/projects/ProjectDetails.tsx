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
import { Progress } from "@/ui/progress";

import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";

import TeamIcon from "@/icons/TeamIcon";

import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { useGetSprintsInProjectQuery } from "@/services/sprints";
import EditProjectModal from "@/components/Projects/EditProjectModal";
import { Project } from "@/types/project.types";
import CreateProjectSprintModal from "@/components/Projects/CreateProjectSprintModal";
import SprintsContainer from "@/components/Sprints/SprintsContainer";
import CreateProjectTaskModal from "@/components/Projects/CreateProjectTaskModal";
import { useGetTasksInProjectQuery } from "@/services/tasks";
import TasksContainer from "@/components/Tasks/TasksContainer";
import { round } from "@/lib/round";
import orderBy from "lodash/orderBy";
import { ScrollArea } from "@/ui/scroll-area";
import InviteUsersModal from "@/components/Users/InviteUsersModal";
import { ROLES } from "@/constants/roles";
import { Button } from "@/ui/button";
import SetProjectActiveSprintModal from "@/components/Projects/SetProjectActiveSprintModal";
import SprintCard from "@/components/Sprints/SprintCard";
import { AppUserProfile } from "@/types/user.types";

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

  const {
    data: tasks = [],
    isLoading: tasksLoading,
    isSuccess: tasksSuccess,
    isError: tasksIsError,
    error: tasksError,
  } = useGetTasksInProjectQuery(id as string, { skip: !id });

  const isLoading =
    colLoading ||
    projectLoading ||
    teamLoading ||
    sprintsLoading ||
    tasksLoading;
  const isSuccess =
    colSuccess &&
    projectSuccess &&
    teamSuccess &&
    sprintsSuccess &&
    tasksSuccess;
  const isError =
    colIsError || projectError || teamIsError || sprintsIsError || tasksIsError;

  const error = serializeError({
    team: teamError,
    projectDetails: projError,
    projectColumns: colError,
    sprintDetails: sprintsError,
    tasksList: tasksError,
  });

  const orderedColumns = useMemo(() => {
    if (project?.columns?.length && columns?.length) {
      return [...columns].sort((a, b) => {
        return project.columns.indexOf(a.id) - project.columns.indexOf(b.id);
      });
    }

    return [];
  }, [columns, project?.columns]);

  const progressValue = round(
    (100 * (project?.currentPoints || 0)) / (project?.totalPoints || 1),
    2
  );

  const canView =
    project?.admin === user?.id ||
    project?.members.includes(user?.id as string);

  const orderedTeam = useMemo(
    () => orderBy(team, [(user) => user.name.toLowerCase()], ["asc"]),
    [team]
  );

  const activeSprint = useMemo(() => {
    return sprints.find((s) => s.id === project?.activeSprintId);
  }, [project?.activeSprintId, sprints]);

  // console.log({ orderedTeam, team });

  return (
    <div className="">
      <AppHeaderNav>
        <NavLink className={"font-medium text-c5-300"} to={"/projects"}>
          Back
        </NavLink>
      </AppHeaderNav>

      <div className="p-2.5 py-4 md:p-4">
        <div className="space-y-4">
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

          <ErrorComponent
            show={!!project?.isRemoved}
            message={
              <h3 className="max-w-full text-xl font-bold text-center ">
                This project has been removed
              </h3>
            }
          />

          <ErrorComponent
            show={!canView && !isLoading}
            message={
              <h3 className="max-w-full text-xl font-bold text-center ">
                You are not part of this project
              </h3>
            }
          />
        </div>

        <CaseRender condition={isSuccess && !project?.isRemoved && !!canView}>
          <div className="grid grid-cols-[minmax(0,1fr)] gap-2 lg:grid-cols-[minmax(0,1fr)_minmax(50px,0.35fr)]">
            <div className="px-2 md:px-4">
              <div className="gap-2 mb-6 md:gap-8 btwn">
                <div className="flex-1 gap-1 md:gap-4 start">
                  {project?.imageUrl ? (
                    <img
                      alt="Project Avatar"
                      className="self-start object-cover object-center w-10 rounded-full md:w-16 aspect-square"
                      height={64}
                      src={project?.imageUrl}
                    />
                  ) : (
                    <></>
                  )}
                  <div className="flex-1">
                    <h1 className="text-xl font-bold md:text-2xl">
                      {project?.name}
                    </h1>
                    <div className="mt-2 space-x-1 text-sm btwn">
                      <p>{progressValue}%</p>
                      <Progress className="flex-1 h-2" value={progressValue} />
                    </div>
                  </div>
                </div>

                <DropdownMenu open={open} onOpenChange={setOpen}>
                  <DropdownMenuTrigger
                    className="self-start p-2 cursor-pointer"
                    aria-label="Project Actions Menu"
                  >
                    <DotsHorizontalIcon />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="-translate-x-[10%]">
                    <EditProjectModal
                      project={project as Project}
                      columns={columns}
                      orderedColumns={orderedColumns}
                      user={user}
                      closeModal={setOpen}
                    />
                    <CreateProjectTaskModal
                      team={orderedTeam}
                      user={user}
                      projectId={project?.id as string}
                      closeModal={setOpen}
                      newTaskOrder={tasks.length || 0}
                    />
                    <CreateProjectSprintModal
                      user={user}
                      project={project as Project}
                      closeModal={setOpen}
                    />
                    <SetProjectActiveSprintModal
                      closeModal={setOpen}
                      activeSprintId={project?.activeSprintId as string}
                      sprints={sprints}
                      projectId={project?.id as string}
                      disabled={user?.role !== ROLES.ADMIN}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="grid gap-6">
                <div>
                  <h2 className="mb-2 text-lg font-semibold">
                    Project Details
                  </h2>
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
                  <h2 className="mb-2 text-lg font-semibold ">
                    Project Description
                  </h2>
                  <div className="text-sm text-gray-500 whitespace-pre-line ">
                    <p>{project?.description}</p>
                  </div>
                </div>

                <div>
                  <h2 className="mb-2 text-lg font-semibold">
                    Project Columns
                  </h2>

                  <ol className="max-w-md space-y-1 text-gray-500 list-decimal list-inside">
                    {orderedColumns.map((col) => (
                      <li key={col.id}>{col.name}</li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h2 className="mb-2 text-lg font-semibold">
                    Project Sprints
                  </h2>

                  {activeSprint?.id ? (
                    <div className="my-4 space-y-2">
                      <h2 className="text-base font-medium text-c5-300">
                        Active Sprint
                      </h2>
                      <SprintCard
                        isActive
                        user={user as AppUserProfile}
                        sprint={activeSprint}
                        projects={[
                          {
                            id: project?.id as string,
                            name: project?.name as string,
                          },
                        ]}
                      />
                    </div>
                  ) : (
                    <></>
                  )}

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

                  <TasksContainer
                    projectName={project?.name as string}
                    tasks={tasks}
                    users={orderedTeam}
                  />
                </div>
              </div>
            </div>

            <div className="relative px-3 md:px-4 lg:px-0 ">
              <div className="p-4 rounded-lg max-w-64 lg:max-w-unset lg:sticky lg:top-0 bg-c2-100/50">
                <h2 className="mb-4 text-lg font-semibold">Project Team</h2>

                <div className="max-h-screen">
                  <ScrollArea className="h-full">
                    <div className="my-3">
                      <InviteUsersModal
                        projectId={project?.id as string}
                        projectName={project?.name as string}
                        adminName={user?.name as string}
                        invitedBy={user?.id as string}
                        disabled={user?.role !== ROLES.ADMIN}
                        renderInviteButton={() => (
                          <Button
                            className="disabled:cursor-not-allowed"
                            disabled={user?.role !== ROLES.ADMIN}
                          >
                            + Invite users
                          </Button>
                        )}
                      />
                    </div>
                    <div className="grid gap-4">
                      {orderedTeam.map((t) => (
                        <div key={t.id} className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage
                              className="object-cover object-center"
                              alt={t.name}
                              src={t.avatarUrl}
                            />
                            <AvatarFallback>
                              {t.name[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium capitalize">
                              {t.name.toLowerCase()}
                            </p>
                            <p className="text-sm text-gray-500 capitalize ">
                              {t.role?.toLowerCase()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </div>
        </CaseRender>
      </div>
    </div>
  );
};

export default ProjectDetails;
