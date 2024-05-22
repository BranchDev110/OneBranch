import AppHeaderNav from "@/components/AppHeaderNav";
import useLoggedInUser from "@/hooks/useLoggedInUser";
import { useGetAllUserSprintsQuery } from "@/services/sprints";
import {} from "react";
// import { NavLink, useParams, useNavigate } from "react-router-dom";

const AllSprints = () => {
  const { user } = useLoggedInUser();

  const { data = [] } = useGetAllUserSprintsQuery(user?.id as string, {
    skip: !user?.id,
  });

  return (
    <div>
      <AppHeaderNav>
        <h3 className={"font-medium text-c5-300"}>All Sprints</h3>
      </AppHeaderNav>

      <div className="p-4">
        <pre className="break-all whitespace-break-spaces">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default AllSprints;
