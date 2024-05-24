import AppHeaderNav from "@/components/AppHeaderNav";
import {} from "react";
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

const SprintDetails = () => {
  const { id } = useParams();

  const {
    data: sprint,
    isLoading: sprintLoading,
    isSuccess: sprintSuccess,
    isError: sprintIsError,
    error: sprintError,
  } = useGetSprintQuery(id as string, { skip: !id });

  const isLoading = sprintLoading;
  const isSuccess = sprintSuccess;
  const isError = sprintIsError;
  const error = serializeError({ error: sprintError });

  const progressValue = round(
    (100 * (sprint?.currentPoints || 0)) / (sprint?.totalPoints || 1),
    2
  );

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
              placeholder="Search...."
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
          show={!!sprint?.isRemoved}
          message={
            <h3 className="max-w-full text-xl font-bold text-center ">
              This sprint has been removed
            </h3>
          }
        />
      </div>

      <CaseRender condition={isSuccess && !sprint?.isRemoved}>
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
      </CaseRender>
    </div>
  );
};

export default SprintDetails;
