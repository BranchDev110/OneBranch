import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "@/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";

import { Button } from "@/ui/button";
import { Task } from "@/types/task.types";
import { useState } from "react";
import { useImportTaskMutation } from "@/services/tasks";
import { cn } from "@/lib/utils";

interface Props {
  sprintId: string;
  order: number;
  tasks: Task[];
}

const ImportSprint = ({ sprintId, order, tasks = [] }: Props) => {
  const [taskId, setTaskId] = useState("");
  const [open, setOpen] = useState(false);

  const [trigger, triggerRes] = useImportTaskMutation();

  const onImportTask = async () => {
    const body = {
      taskId,
      sprintId,
      order,
    };

    try {
      toast.dismiss();
      toast.loading("Importing tasks...");

      await trigger(body).unwrap();

      toast.dismiss();
      toast.success("Import successful");

      setTaskId("");
      setOpen(false);
    } catch (error: any) {
      toast.dismiss();

      const msg = error?.message || "Unable to import task";
      toast.error(msg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={!tasks.length} variant={"outline"}>
          Import from project
        </Button>
      </DialogTrigger>

      <DialogContent className="w-10/12 max-w-xl">
        <div className="p-4">
          <h1 className="my-3 mb-6 text-3xl font-bold text-center">
            Import task from current project
          </h1>

          <Select onValueChange={setTaskId} value={taskId}>
            <SelectTrigger>
              <SelectValue placeholder="Select task" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Choose Task</SelectLabel>

                {tasks.map((t) => (
                  <SelectItem key={t.id} value={`${t.id}`}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="mt-5 mb-3 end">
            <Button
              className={cn({ "animate-pulse": triggerRes.isLoading })}
              disabled={!taskId || triggerRes.isLoading}
              onClick={onImportTask}
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportSprint;
