import {} from "react";
import logo from "@/assets/water.png";
import { NavLink } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";

import BoardIcon from "@/icons/BoardIcon";
import SprintIcon from "@/icons/SprintIcon";
import ChartIcon from "@/icons/ChartIcon";
import SettingsIcon from "@/icons/SettingsIcon";

import LogoutIcon from "@/icons/LogoutIcon";
import { useLogout } from "@/hooks/useLogout";
import ProjectSideBar from "./ProjectSideBar";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn("center rounded-md w-10 h-10 mx-auto transiiton-colors hover:text-c2", {
    ["bg-c2/10 text-c2"]: isActive,
  });

const SideBar = () => {
  const { handleLogout } = useLogout();

  return (
    <div className="fixed h-screen top-0 left-0 w-[72px]">
      <nav className="relative flex-col h-full px-2 py-8 bg-white border-r z-menu btwn">
        <div className="relative h-full">
          <NavLink className="pb-4 border-b center" to="/">
            <img className="w-10 h-10" src={logo} alt="logo" />
            <span className="sr-only">Dashboard</span>
          </NavLink>

          <section className="flex-1 mt-10 space-y-6">
            <NavLink className={linkClass} to="/">
              <i className="block w-10 h-10 center">
                <BoardIcon className="w-[18px] h-[18px]" />
              </i>
              <span className="sr-only">Dashboard</span>
            </NavLink>
            <NavLink className={linkClass} to="/sprints">
              <i className="block w-10 h-10 center">
                <SprintIcon className="w-[18px] h-[18px]" />
              </i>
              <span className="sr-only">Sprints</span>
            </NavLink>

            <NavLink className={linkClass} to="/projects">
              <i className="block w-10 h-10 center">
                <ChartIcon className="w-[18px] h-[18px]" />
              </i>
              <span className="sr-only">Projects</span>
            </NavLink>
            <NavLink className={linkClass} to="/settings">
              <i className="block w-10 h-10 center">
                <SettingsIcon className="w-[18px] h-[18px]" />
              </i>
              <span className="sr-only">Settings</span>
            </NavLink>
          </section>

          <Button
            onClick={handleLogout}
            type="button"
            variant={"ghost"}
            size="icon"
            className="absolute bottom-[5%] w-12 h-12 p-1 mx-auto -translate-x-1/2 left-1/2 !text-c4 center "
          >
            <LogoutIcon className="w-8 h-8" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </nav>
      <ProjectSideBar />
    </div>
  );
};

export default SideBar;
