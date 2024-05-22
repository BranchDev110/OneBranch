import AppHeaderNav from "@/components/AppHeaderNav";
import CaseRender from "@/components/CaseRender";
import ErrorComponent from "@/components/ErrorComponent";
import LoadingComponent from "@/components/LoadingComponent";
import useLoggedInUser from "@/hooks/useLoggedInUser";
import { useGetUsersProjectsQuery } from "@/services/projects";
import { useGetAllUserSprintsQuery } from "@/services/sprints";
import {} from "react";
import SprintsContainer from "@/components/Sprints/SprintsContainer";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/ui/dialog";
import CreateNewSprint from "@/components/Sprints/CreateNewSprint";
import { UserProfile } from "@/types/user.types";

const AllSprints = () => {
  const { user } = useLoggedInUser();

  const {
    data: sprints = [],
    isLoading,
    isError,
    error,
    isSuccess,
  } = useGetAllUserSprintsQuery(user?.id as string, {
    skip: !user?.id,
  });

  const { data: projects = [] } = useGetUsersProjectsQuery(user!.id as string, {
    skip: !user?.id,
  });

  const getProject = (projectId: string) => {
    const proj = { id: "", name: "" };
    const p = projects.find((p) => p.id === projectId);

    if (p?.id) {
      proj.name = p.name;
      proj.id = p.id;
    }

    return proj;
  };

  return (
    <div>
      <AppHeaderNav>
        <h3 className={"font-medium text-c5-300"}>All Sprints</h3>
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

        <CaseRender condition={isSuccess}>
          <div className="my-3 btwn">
            <h1 className="text-xl font-bold">{sprints.length} sprints</h1>
            <CreateNewSprint user={user as UserProfile} />
          </div>
          <SprintsContainer sprints={sprints} getProject={getProject} />
        </CaseRender>
      </div>
    </div>
  );
};

export default AllSprints;
