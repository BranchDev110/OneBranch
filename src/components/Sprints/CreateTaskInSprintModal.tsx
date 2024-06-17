/* eslint-disable @typescript-eslint/ban-types */
import { ReactNode, useState } from "react";
import { AppUserProfile } from "@/types/user.types";
import { Dialog, DialogContent, DialogTrigger } from "@/ui/dialog";
import { Button } from "@/ui/button";
import { ScrollArea } from "@/ui/scroll-area";
import TaskForm from "../Tasks/TaskForm";
import { UseMutationResult } from "@/types/rtk.types";

interface Props {
  onCreateTask: (values: any, callback?: Function) => void;
  renderTrigger?: () => ReactNode;
  userId: string;
  team: AppUserProfile[];
  submitRes: UseMutationResult<any>;
  projectId: string;
}

const CreateTaskInSprintModal = ({
  onCreateTask,
  renderTrigger,
  userId,
  submitRes,
  team = [],
  projectId,
}: Props) => {
  const [open, setOpen] = useState(false);

  const handleCreate = (values: any) => {
    onCreateTask(values, () => setOpen(false));
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {renderTrigger ? (
          <span>{renderTrigger()}</span>
        ) : (
          <Button
            variant={"secondary"}
            className="font-medium text-c5-200 border-primary self-start md:self-center !bg-c2/40"
          >
            + Create Task
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-3xl w-11/12 pt-10 px-8 h-[80vh]">
        <ScrollArea className="h-full">
          <TaskForm
            userId={userId}
            projectId={projectId}
            submitRes={submitRes}
            onSubmit={handleCreate}
            memberOptions={team}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskInSprintModal;
