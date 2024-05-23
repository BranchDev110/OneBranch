import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/ui/dialog";

import TaskForm from "../Tasks/TaskForm";
import { useCreateTaskMutation } from "@/services/tasks";
import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";
import { AppUserProfile } from "@/types/user.types";
import { Button } from "@/ui/button";
import { ScrollArea } from "@/ui/scroll-area";
import { CreateTaskBody } from "@/types/task.types";
import { TASK_STATUS } from "@/constants/task-status";

interface Props {
  user?: AppUserProfile;
  projectId: string;
  team: AppUserProfile[];
  closeModal?: (val: boolean) => void;
}

const CreateProjectTaskModal = ({
  user,
  projectId,
  team = [],
  closeModal,
}: Props) => {
  const [open, setOpen] = useState(false);
  //   const navigate = useNavigate();

  const [createTask, createRes] = useCreateTaskMutation();

  const selectableMembers = team.filter((m) => m.id !== user?.id);

  const handleOpenChange = (val: boolean) => {
    setOpen(val);

    if (!val) {
      closeModal && closeModal(false);
    }
  };

  const onCreateTask = async (values: Omit<CreateTaskBody, "status">) => {
    toast.dismiss();
    toast.loading("Creating task...");

    try {
      const body: CreateTaskBody = {
        name: values.name,
        description: values.description,
        sprintId: "",
        projectId,
        assignees: values.assignees,
        createdBy: user?.id as string,
        storyPoint: values.storyPoint,
        dueDate: values.dueDate,
        status: TASK_STATUS.TODO,
        fileUrls: values.fileUrls,
      };

      await createTask(body).unwrap();

      toast.dismiss();
      toast.success("Created task");

      handleOpenChange(false);
    } catch (error: any) {
      toast.dismiss();

      const msg = error?.message || "Unable to create task for project";
      toast.error(msg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="block w-full pl-2 font-normal text-start h-unset"
        >
          <span>Create Task</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl w-11/12 pt-10 px-8 h-[80vh]">
        <ScrollArea className="h-full">
          <TaskForm
            userId={user?.id as string}
            projectId={projectId}
            submitRes={createRes}
            onSubmit={onCreateTask}
            memberOptions={selectableMembers}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectTaskModal;
