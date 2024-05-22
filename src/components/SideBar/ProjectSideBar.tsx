import { useRef } from "react";
import UnionIcon from "@/icons/UnionIcon";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { NavLink } from "react-router-dom";

import { useGetUsersProjectsQuery } from "@/services/projects";
import useLoggedInUser from "@/hooks/useLoggedInUser";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

const ProjectSideBar = () => {
  const { user } = useLoggedInUser();
  const [open, setOpen] = useState(false);
  const { data: projects = [] } = useGetUsersProjectsQuery(user!.id as string, {
    skip: !user?.id,
  });

  const sideBarRef = useRef<null | HTMLDivElement>(null);

  const toggle = () => setOpen((s) => !s);

  useOnClickOutside(sideBarRef, () => setOpen(false));

  return (
    <>
      <button
        aria-label="Open Projects"
        className="absolute left-[72px]  bg-white top-1/4
         -translate-x-1/2 border p-2.5  z-toggler center shadow-[0px_0px_4px_0px_rgba(0,0,0,0.15)] rounded-lg"
        onClick={toggle}
        type="button"
      >
        <UnionIcon className="w-3.5 h-2" />
      </button>

      <div
        ref={sideBarRef}
        className={cn(
          "fixed px-5 left-[72px] h-screen z-nav  overflow-y-auto top-0 transition-all w-[240px] bg-white border py-10",
          {
            "translate-x-0  pointer-events-auto": open,
            "-translate-x-full pointer-events-none ": !open,
          }
        )}
      >
        <h4 className="text-lg font-semibold text-c5-100">Projects</h4>

        <section className="mt-2 space-y-3">
          {projects.slice(0, 4).map((p) => (
            <NavLink
              //TO DO CHANGE TO project later
              to={`/projects/${p.id}`}
              className={({ isActive }) =>
                cn(
                  "block w-full border text-sm font-semibold border-c5-50 rounded-lg p-2 transition-colors hover:text-c2",
                  {
                    ["bg-c2/10 text-c2"]: isActive,
                    ["bg-white text-c5-100"]: !isActive,
                  }
                )
              }
              key={p.id}
            >
              {p.name}
            </NavLink>
          ))}
        </section>
      </div>
    </>
  );
};

export default ProjectSideBar;
