import { useState } from "react";
import SprintForm from "@/components/Sprints/SprintForm";
import { Dialog, DialogContent, DialogTrigger } from "@/ui/dialog";
import { Button } from "@/ui/button";
import { ScrollArea } from "@/ui/scroll-area";
import { AppUserProfile } from "@/types/user.types";
import { Project } from "@/types/project.types";
import { useCreateSprintMutation } from "@/services/sprints";
import { CreateSprintBody } from "@/types/sprint.types";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Props {
  user?: AppUserProfile;
  project: Project;
  closeModal?: (val: boolean) => void;
}

const CreateProjectSprintModal = ({ user, project, closeModal }: Props) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [createSprint, createRes] = useCreateSprintMutation();

  const onCreateSprint = async (values: CreateSprintBody) => {
    // console.log(values);

    toast.dismiss();
    toast.loading("Creating sprint...");
    try {
      const res = await createSprint(values).unwrap();
      toast.dismiss();
      toast.success("Created sprint");

      navigate(`/sprints/${res.id}`);
    } catch (error: any) {
      toast.dismiss();

      const msg = error?.message || "Unable to create sprint for project";
      toast.error(msg);
    }
  };

  const handleOpenChange = (val: boolean) => {
    setOpen(val);

    if (!val) {
      closeModal && closeModal(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="block w-full pl-2 font-normal text-start h-unset"
        >
          <span>Create Sprint</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl w-11/12 pt-10  px-2 md:px-8 h-[80vh] rounded-md">
        <ScrollArea className="h-full">
          <SprintForm
            userId={user!.id as string}
            submitRes={createRes}
            onSubmit={onCreateSprint}
            projectId={project?.id}
            projectList={[
              {
                id: project?.id as string,
                name: project?.name as string,
              },
            ]}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectSprintModal;
