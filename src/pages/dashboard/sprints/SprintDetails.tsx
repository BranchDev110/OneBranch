import AppHeaderNav from "@/components/AppHeaderNav";
import {} from "react";
import {
  NavLink,
  useParams,
  //  , useNavigate
} from "react-router-dom";

import { Input } from "@/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

const SprintDetails = () => {
  const { id } = useParams();

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

      <div className="p-4 bg-white border-b py-7 btwn">
        <p>Sptint ID: {id}</p>
      </div>
    </div>
  );
};

export default SprintDetails;
