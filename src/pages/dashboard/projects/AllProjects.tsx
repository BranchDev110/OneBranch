import AppHeaderNav from "@/components/AppHeaderNav";
import useLoggedInUser from "@/hooks/useLoggedInUser";
import { useGetUsersProjectsQuery } from "@/services/projects";
import { Button } from "@/ui/button";
import {} from "react";
import { NavLink } from "react-router-dom";

const AllProjects = () => {
  const { user } = useLoggedInUser();

  const { data: projects = [] } = useGetUsersProjectsQuery(user!.id as string, {
    skip: !user?.id,
  });

  return (
    <div>
      <AppHeaderNav>
        <h6 className="font-medium text-c5-300 ">All Projects</h6>
      </AppHeaderNav>

      <div className="p-4">
        <Button asChild>
          <NavLink to="/projects/new">
            + New Project (Fix later to admin only)
          </NavLink>
        </Button>

        <div>
          <pre>{JSON.stringify(projects, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default AllProjects;
