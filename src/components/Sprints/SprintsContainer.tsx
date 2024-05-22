import { Sprint } from "@/types/sprint.types";
import { useState, useMemo } from "react";
import { matchSorter } from "match-sorter";
import { Input } from "@/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Thing } from "@/types/generic.types";
import SprintCard from "@/components/Sprints/SprintCard";
import useLoggedInUser from "@/hooks/useLoggedInUser";
import { UserProfile } from "@/types/user.types";

interface Props {
  sprints: Sprint[];
  defaultProject?: Thing;
  getProject?: (projectId: string) => Thing;
}

const SprintsContainer = ({
  sprints = [],
  defaultProject,
  getProject,
}: Props) => {
  const { user } = useLoggedInUser();
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  const data = useMemo(() => {
    let filteredSprints = sprints;

    if (query?.trim()) {
      filteredSprints = matchSorter(sprints, query, {
        keys: ["name", "description"],
        threshold: matchSorter.rankings.CONTAINS,
      });
    }

    return filteredSprints;
  }, [query, sprints]);

  return (
    <div>
      <div className="end">
        <div className="relative basis-2/3">
          <i className="absolute -translate-y-1/2 left-2 top-1/2">
            <MagnifyingGlassIcon />
          </i>
          <Input
            value={query}
            onChange={handleChange}
            placeholder="Search sprints...."
            className="block w-full pl-7 bg-c5-50 rounded-xl"
            type="search"
          />
        </div>
      </div>

      <div className="gap-2 mt-4 grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] grid-flow-dense">
        {data?.length ? (
          <>
            {data.map((sprint) => (
              <SprintCard
                user={user}
                key={sprint.id}
                sprint={sprint}
                projects={[
                  defaultProject ||
                    (getProject
                      ? getProject(sprint.projectId)
                      : { id: "", name: "" }),
                ]}
              />
            ))}
          </>
        ) : (
          <div className="w-full min-h-[20vh] p-2 text-center center col-span-full ">
            <h1 className="text-xl font-bold ">No sprints found</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default SprintsContainer;
