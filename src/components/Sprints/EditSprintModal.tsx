import { Sprint } from "@/types/sprint.types";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "@/ui/dialog";
import { Button } from "@/ui/button";
import { ScrollArea } from "@/ui/scroll-area";
import { AppUserProfile } from "@/types/user.types";
import { ROLES } from "@/constants/roles";
import { useUpdateSprintMutation } from "@/services/sprints";
import SprintForm from "./SprintForm";
import { Thing } from "@/types/generic.types";

interface Props {
  sprint: Sprint;
  user: AppUserProfile;
  closeModal?: (val: boolean) => void;
  projects: Thing[];
}

const EditSprintModal = ({
  sprint,
  closeModal,
  user,
  projects = [],
}: Props) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (val: boolean) => {
    setOpen(val);

    if (!val) {
      closeModal && closeModal(false);
    }
  };

  const [edit, editRes] = useUpdateSprintMutation();

  const onEditSprint = async (values: any) => {
    // console.log(values);

    toast.dismiss();
    toast.loading("Editing sprint...");

    try {
      await edit({ ...sprint, id: sprint.id, ...values }).unwrap();

      toast.dismiss();
      toast.success("Edited sprint");
      handleOpenChange(false);
    } catch (error: any) {
      toast.dismiss();

      const msg = error?.message || "Unable to edit sprint";
      toast.error(msg);
    }
  };

  const disableEdit = () => {
    if (user?.role === ROLES.ADMIN) {
      return false;
    }

    if (sprint.createdBy === user?.id) {
      return false;
    }

    return true;
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          disabled={disableEdit()}
          variant={"ghost"}
          className="block w-full pl-2 font-normal text-start h-unset"
        >
          <span>Edit Sprint</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl w-11/12 pt-10 md:px-8 px-2 rounded-md h-[80vh]">
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
  );
};

export default EditSprintModal;
