import { useState } from "react";
import { Progress } from "@/ui/progress";
import { DialogTrigger, DialogContent, Dialog } from "@/components/ui/dialog";
import {
  DropdownMenuTrigger,
  //   DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/ui/button";

import { Sprint } from "@/types/sprint.types";
import { CalendarIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { format } from "date-fns/format";
import { isValid } from "date-fns/isValid";
import SprintForm from "./SprintForm";
import { ScrollArea } from "@/ui/scroll-area";
import { Thing } from "@/types/generic.types";
import { useUpdateSprintMutation } from "@/services/sprints";
import { round } from "@/lib/round";
import { toast } from "sonner";

interface Props {
  sprint: Sprint;
  projects?: Thing[];
  closeModal?: (val: boolean) => void;
}

const SprintCard = ({ sprint, projects = [], closeModal }: Props) => {
  const [openMenu, setOpenMenu] = useState(false);

  const [open, setOpen] = useState(false);

  const { name, endDate, startDate, description, totalPoints, currentPoints } =
    sprint;

  const [edit, editRes] = useUpdateSprintMutation();

  const handleDialogChange = (val: boolean) => {
    setOpen(val);

    if (!val) {
      closeModal && closeModal(false);
      setOpenMenu(false);
    }
  };

  const onEditSprint = async (values: any) => {
    // console.log(values);

    toast.dismiss();
    toast.loading("Editing sprint...");

    try {
      await edit({ ...sprint, id: sprint.id, ...values }).unwrap();

      toast.dismiss();
      toast.success("Edited sprint");
      handleDialogChange(false);
    } catch (error: any) {
      toast.dismiss();

      const msg = error?.message || "Unable to edit sprint";
      toast.error(msg);
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
            <Dialog open={open} onOpenChange={handleDialogChange}>
              <DialogTrigger asChild>
                <Button
                  variant={"ghost"}
                  className="block w-full pl-2 font-normal text-start h-unset"
                >
                  <span>Edit Sprint</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl pt-10 px-8 h-[80vh]">
                <ScrollArea className="h-full">
                  <SprintForm
                    userId={sprint.createdBy}
                    submitRes={editRes}
                    onSubmit={onEditSprint}
                    projectId={sprint.projectId}
                    projectList={projects}
                    sprint={sprint}
                  />
                </ScrollArea>
              </DialogContent>
            </Dialog>
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
