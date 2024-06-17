import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "@/ui/dialog";
import { Button } from "@/ui/button";
import { ScrollArea } from "@/ui/scroll-area";
import { AppUserProfile } from "@/types/user.types";
import { ROLES } from "@/constants/roles";
import { CreateTaskBody, TaskWithPopulatedUsers } from "@/types/task.types";
import TaskForm from "./TaskForm";
import { useUpdateTaskMutation } from "@/services/tasks";
import useDeleteImagesFromFirebase from "@/hooks/useDeleteImagesFromFirebase";
import differenceWith from "lodash/differenceWith";

interface Props {
  task: TaskWithPopulatedUsers;
  user: AppUserProfile;
  closeModal?: (val: boolean) => void;
  memberOptions: AppUserProfile[];
}

const EditTaskModal = ({
  closeModal,
  user,
  task,
  memberOptions = [],
}: Props) => {
  const [open, setOpen] = useState(false);

  const { handleDelete } = useDeleteImagesFromFirebase();
  const [editTask, editRes] = useUpdateTaskMutation();

  const handleOpenChange = (val: boolean) => {
    setOpen(val);

    if (!val) {
      closeModal && closeModal(false);
    }
  };

  const flattenedTask = {
    ...task,
    assignees: task.assignees.map((a) => a?.id).filter((a) => a),
  };

  const canEditTask = () => {
    let disabled = true;

    if (
      flattenedTask.assignees.includes(user?.id as string) ||
      task.createdBy === (user?.id as string) ||
      user.role === ROLES.ADMIN
    ) {
      disabled = false;
    }

    return disabled;
  };

  const onEditTask = async (
    values: CreateTaskBody & { filesToRemove?: string[] }
  ) => {
    toast.dismiss();
    toast.loading("Updating task...");

    try {
      const body = {
        ...flattenedTask,
        ...values,
        id: flattenedTask.id as string,
        oldPoints: task.storyPoint,
        fileUrls: differenceWith(
          flattenedTask.fileUrls,
          values.filesToRemove ?? [],
          (a, bItem) => a === bItem
        ),
      };

      await editTask(body).unwrap();

      toast.dismiss();
      toast.success("Updated task");

      if (body?.filesToRemove?.length) {
        handleDelete(body?.filesToRemove);
      }

      handleOpenChange(false);
    } catch (error: any) {
      toast.dismiss();

      const msg = error?.message || "Unable to edit task details";
      toast.error(msg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          disabled={canEditTask()}
          variant={"ghost"}
          className="block w-full pl-2 font-normal text-start h-unset"
        >
          <span>Edit Task</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="w-10/12 md:w-3/4 max-w-xl pt-10 px-2 md:px-8 h-[80vh] rounded-md">
        <ScrollArea className="h-full">
          <TaskForm
            userId={user?.id as string}
            task={flattenedTask}
            projectId={task.projectId}
            memberOptions={memberOptions}
            submitRes={editRes}
            onSubmit={onEditTask}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskModal;
