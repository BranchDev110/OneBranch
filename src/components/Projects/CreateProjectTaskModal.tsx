import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/ui/dialog";

import TaskForm from "../Tasks/TaskForm";
import { useCreateTaskMutation } from "@/services/tasks";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AppUserProfile } from "@/types/user.types";
import { Button } from "@/ui/button";

interface Props {
  user?: AppUserProfile;
  projectId: string;
}

const CreateProjectTaskModal = ({ user, projectId }: Props) => {
  const [createTask, createRes] = useCreateTaskMutation();

  const onCreateSprint = async (values: any) => {
    toast.dismiss();

    try {
      console.log(values);
    } catch (error: any) {
      toast.dismiss();

      const msg = error?.message || "Unable to create task for project";
      toast.error(msg);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="block w-full pl-2 font-normal text-start h-unset"
        >
          <span>Create Task</span>
        </Button>
      </DialogTrigger>
    </Dialog>
  );
};

export default CreateProjectTaskModal;
