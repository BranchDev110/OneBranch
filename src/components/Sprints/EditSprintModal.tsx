import { Sprint } from "@/types/sprint.types";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "@/ui/dialog";
import { Button } from "@/ui/button";
import { ScrollArea } from "@/ui/scroll-area";
import { UserProfile } from "firebase/auth";
import { ROLES } from "@/constants/roles";
import { useUpdateSprintMutation } from "@/services/sprints";
import SprintForm from "./SprintForm";
import { Thing } from "@/types/generic.types";

interface Props {
  sprint: Sprint;
  user: UserProfile;
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          disabled={user?.role !== ROLES.ADMIN || sprint.createdBy !== user?.id}
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
  );
};

export default EditSprintModal;
