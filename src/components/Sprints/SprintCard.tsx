import { useState } from "react";
import { Progress } from "@/ui/progress";
import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";

import { Sprint } from "@/types/sprint.types";
import { CalendarIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { format } from "date-fns/format";
import { isValid } from "date-fns/isValid";

import { Thing } from "@/types/generic.types";
import { round } from "@/lib/round";
import { NavLink } from "react-router-dom";
import { AppUserProfile } from "@/types/user.types";
import DeleteSprintModal from "./DeleteSprintModal";
import EditSprintModal from "./EditSprintModal";

interface Props {
  sprint: Sprint;
  projects?: Thing[];
  closeModal?: (val: boolean) => void;
  user: AppUserProfile;
}

const SprintCard = ({ sprint, projects = [], closeModal, user }: Props) => {
  const [openMenu, setOpenMenu] = useState(false);

  const {
    id,
    name,
    endDate,
    startDate,
    description,
    totalPoints,
    currentPoints,
  } = sprint;

  const handleDialogChange = (val: boolean) => {
    if (!val) {
      closeModal && closeModal(false);
      setOpenMenu(false);
    }
  };

  const progressValue = round((100 * currentPoints) / (totalPoints || 1), 2);

  return (
    <article className="p-3 px-4 bg-white rounded-lg">
      <header className="btwn">
        <div className="flex items-center gap-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{name}</h3>
            <div className="space-x-2 text-sm text-gray-500 start">
              <CalendarIcon className="text-gray-500 " />
              <p>
                {isValid(new Date(startDate as string))
                  ? format(new Date(startDate as string), "LLLL dd, yyyy")
                  : ""}{" "}
                -{" "}
                {isValid(new Date(endDate as string))
                  ? format(new Date(endDate as string), "LLLL dd, yyyy")
                  : ""}
              </p>
            </div>
          </div>
        </div>
        <DropdownMenu open={openMenu} onOpenChange={setOpenMenu}>
          <DropdownMenuTrigger aria-label="Toggle menu">
            <DotsHorizontalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <NavLink className={""} to={`/sprints/${id}`}>
                View Sprint
              </NavLink>
            </DropdownMenuItem>

            <EditSprintModal
              user={user}
              closeModal={handleDialogChange}
              sprint={sprint}
              projects={projects}
            />
            <DeleteSprintModal
              user={user}
              closeModal={handleDialogChange}
              sprint={sprint}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <section className="">
        <div className="mt-2 space-x-1 text-sm btwn">
          <p>{progressValue}%</p>
          <Progress className="flex-1 h-2" value={progressValue} />
        </div>
        <h4 className="mt-3 mb-1 text-sm font-semibold text-gray-500">
          Description
        </h4>
        <p className="text-xs text-gray-500 ">{description}</p>
      </section>
    </article>
  );
};

export default SprintCard;
