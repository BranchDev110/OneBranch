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
import Truncatable from "react-truncatable";
import { cn } from "@/lib/utils";

interface Props {
  sprint: Sprint;
  projects?: Thing[];
  closeModal?: (val: boolean) => void;
  user: AppUserProfile;
  isActive?: boolean;
}

const SprintCard = ({
  sprint,
  projects = [],
  closeModal,
  user,
  isActive,
}: Props) => {
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
    <article
      className={cn("p-3 px-4 bg-white rounded-lg", {
        "border border-primary/40": isActive,
      })}
    >
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

      <section className="grid grid-rows-[60px_30px_minmax(0,1fr)]">
        <div className="mt-2 space-x-1 text-sm btwn">
          <p>{progressValue}%</p>
          <Progress className="flex-1 h-2" value={progressValue} />
        </div>
        <h4 className="mt-2 mb-1 text-sm font-semibold text-gray-500">
          Description
        </h4>

        <Truncatable
          className="text-xs text-c5-300 min-h-[50px]"
          as="p"
          content={description}
        />
      </section>
    </article>
  );
};

export default SprintCard;
