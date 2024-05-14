import { cn } from "@/lib/utils";
import { useState } from "react";

const ProjectSideBar = () => {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((s) => !s);

  return (
    <aside className="fixed top-0 left-[72px] bottom-0 ">
      <div className="relative h-full">
        <button
          className="absolute bg-white top-[20%] z-toggler -translate-x-1/2 border p-1 center"
          onClick={toggle}
          type="button"
        >
          open
        </button>

        <div
          className={cn(
            "sticky h-full overflow-y-auto top-0 left-0 transition-all w-[200px] bg-rose-200 border",
            {
              "translate-x-0 opacity-100 pointer-events-auto z-10": open,
              "-translate-x-full opacity-0  pointer-events-none -z-10": !open,
            }
          )}
        ></div>
      </div>
    </aside>
  );
};

export default ProjectSideBar;
