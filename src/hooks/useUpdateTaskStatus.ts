import { toast } from "sonner";

import { UpdateTaskStatusArgs } from "@/types/task.types";

import { useUpdateTaskStatusMutation } from "@/services/tasks";

const useUpdateTaskStatus = () => {
  const [updateStatus, { isLoading }] = useUpdateTaskStatusMutation();

  const onUpdateStatus = async (args: UpdateTaskStatusArgs) => {
    try {
      // console.log(args);
      toast.dismiss();
      toast.loading("Updating task status...");

      await updateStatus(args).unwrap();

      toast.dismiss();
      toast.success("Updated task status");
    } catch (error: any) {
      toast.dismiss();

      const msg = error?.message || "Unable to update task status";
      toast.error(msg);
    }
  };

  return { onUpdateStatus, isLoading };
};

export default useUpdateTaskStatus;
