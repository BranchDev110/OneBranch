import AppHeaderNav from "@/components/AppHeaderNav";
import { useMemo, useState } from "react";
import {
  NavLink,
  useParams,
  //  , useNavigate
} from "react-router-dom";

import { Input } from "@/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useGetSprintQuery } from "@/services/sprints";
import { serializeError } from "serialize-error";
import LoadingComponent from "@/components/LoadingComponent";
import ErrorComponent from "@/components/ErrorComponent";
import CaseRender from "@/components/CaseRender";
import { cn } from "@/lib/utils";
import { round } from "@/lib/round";
import { Progress } from "@/ui/progress";
import { AvatarImage, Avatar, AvatarFallback } from "@/ui/avatar";
import {
  useGetProjectColumnsQuery,
  useGetProjectQuery,
} from "@/services/projects";
import { useGetUsersInProjectQuery } from "@/services/users";
import SprintToolBar from "@/components/Sprints/SprintToolBar";
import { useGetTasksInSprintQuery } from "@/services/tasks";
import SprintBoard from "@/components/Sprints/SprintBoard";
import { matchSorter } from "match-sorter";
import { AppUserProfile } from "@/types/user.types";
import useLoggedInUser from "@/hooks/useLoggedInUser";

const SprintDetails = () => {
  const { user } = useLoggedInUser();
  const { id } = useParams();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<TASK_STATUS | "">("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  const {
    data: sprint,
    isLoading: sprintLoading,
    isSuccess: sprintSuccess,
    isError: sprintIsError,
    error: sprintError,
  } = useGetSprintQuery(id as string, { skip: !id });

  const {
    data: tasks = [],
    isLoading: tasksLoading,
    isSuccess: tasksSuccess,
    isError: tasksIsError,
    error: tasksError,
  } = useGetTasksInSprintQuery(id as string, { skip: !id });

  const {
    data: columns = [],
    isLoading: colLoading,
    isSuccess: colSuccess,
    isError: colIsError,
    error: colError,
  } = useGetProjectColumnsQuery(sprint?.projectId as string, {
    skip: !sprint?.projectId,
  });

  const {
    data: project,
    isLoading: projectLoading,
    isSuccess: projectSuccess,
    isError: projectError,
    error: projError,
  } = useGetProjectQuery(sprint?.projectId as string, {
    skip: !sprint?.projectId,
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

  const isLoading =
    projectLoading ||
    colLoading ||
    sprintLoading ||
    teamLoading ||
    tasksLoading;
  const isSuccess =
    projectSuccess &&
    colSuccess &&
    teamSuccess &&
    sprintSuccess &&
    tasksSuccess;
  const isError =
    colIsError || teamIsError || sprintIsError || projectError || tasksIsError;

  const error = serializeError({
    error: sprintError,
    team: teamError,
    projectColumns: colError,
    projectDetails: projError,
    tasksList: tasksError,
  });

  const progressValue = round(
    (100 * (sprint?.currentPoints || 0)) / (sprint?.totalPoints || 1),
    2
  );

  const orderedColumns = useMemo(() => {
    if (project?.columns?.length && columns?.length) {
      return [...columns].sort((a, b) => {
        return project.columns.indexOf(a.id) - project.columns.indexOf(b.id);
      });
    }

    return [];
  }, [columns, project?.columns]);

  const filteredTasks = useMemo(() => {
    const allTasks = status ? tasks.filter((t) => t.status === status) : tasks;

    if (query?.trim()) {
      return matchSorter(allTasks, query, {
        keys: ["name", "description"],
        threshold: matchSorter.rankings.CONTAINS,
      });
    }

    return allTasks;
  }, [tasks, query, status]);

  return (
    <div>
      <AppHeaderNav className="[&_.children]:basis-1/2">
        <div className="space-x-[10%] btwn">
          <NavLink className={"font-medium text-c5-300"} to={"/sprints"}>
            All Sprints
          </NavLink>
          <div className="relative flex-1">
            <i className="absolute -translate-y-1/2 left-2 top-1/2">
              <MagnifyingGlassIcon />
            </i>
            <Input
              value={query}
              onChange={handleChange}
              placeholder="Search tasks..."
              className="block w-full pl-7 bg-c5-50 rounded-xl"
              type="search"
            />
          </div>
        </div>
      </AppHeaderNav>

      <div className={cn({ ["p-4"]: isLoading || isError })}>
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
          show={!!(sprint?.isRemoved || project?.isRemoved)}
          message={
            <h3 className="max-w-full text-xl font-bold text-center ">
              This sprint has been removed
            </h3>
          }
        />
      </div>

      <CaseRender
        condition={isSuccess && !sprint?.isRemoved && !project?.isRemoved}
      >
        <div className="p-4 bg-white border-b py-7 btwn">
          <div className="basis-1/2 grid items-center gap-2 grid-cols-[40px_minmax(0,1fr)]">
            <div className="overflow-hidden rounded-full aspect-square bg-c5-200 center">
              <Avatar>
                <AvatarImage src={""} alt={sprint?.name} />
                <AvatarFallback>{sprint?.name[0]}</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h5 className="font-bold">{sprint?.name}</h5>
              <div className="space-x-1 btwn">
                <Progress
                  className="bg-c5-50 [&_.bg-primary]:bg-c2-200"
                  value={progressValue}
                />
                <p className="text-xs basis-1/4 text-c1-100">
                  {progressValue}% Complete
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 py-3 ">
          <SprintToolBar
            status={status}
            setStatus={setStatus}
            user={user as AppUserProfile}
            newTaskOrder={tasks?.length || 0}
            sprintId={id as string}
            projectId={project?.id as string}
            team={team}
          />

          <div className="my-3 -mr-10">
            <SprintBoard
              users={team}
              tasks={filteredTasks}
              projectId={project?.id as string}
              columns={orderedColumns}
              sprintId={id as string}
            />
          </div>
        </div>
      </CaseRender>
    </div>
  );
};

export default SprintDetails;
