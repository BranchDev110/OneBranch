import { Task } from "@/types/task.types";
import { ReactNode, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { PlusIcon } from "@radix-ui/react-icons";

import { ScrollArea } from "@/ui/scroll-area";
import { Button } from "@/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";
import { Input } from "@/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";
import { Textarea } from "@/ui/textarea";
import { cn } from "@/lib/utils";

interface Props {
  task?: Task;
  renderButton?: () => ReactNode;
  columnId?: string;
  projectId: string;
  sprintId?: string;
}

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

type Schema = z.infer<typeof formSchema>;

const defaultValues: Schema = { name: "", description: "" };

const CreateEditTaskModal = ({
  task,
  renderButton,
  projectId,
  sprintId,
  columnId,
}: Props) => {
  const [open, setOpen] = useState(false);

  const onSubmit = async (values: Schema) => {
    try {
      // console.log(values);
      //    toast.dismiss();
      //    toast.loading("Logging you in...");
      //    toast.dismiss();
      //    toast.success("Login successful");
      const body = {
        projectId,
        sprintId,
        columnId,
        ...values,
      };

      console.log(body);
      toast.success("TO DO: Success ");
    } catch (error: any) {
      toast.dismiss();

      const msg =
        error?.message ||
        (task?.id ? "Unable to edit task" : "Unable to create task");
      toast.error(msg);
    }
  };

  const form = useForm<Schema>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {renderButton ? (
        <DialogTrigger type="button">
          <span>{renderButton()}</span>
        </DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button className="space-x-2 rounded-xl h-unset">
            <i>
              <PlusIcon className="w-7 h-7" />
            </i>

            <span>New</span>
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="max-w-2xl w-11/12 h-[80vh]">
        <ScrollArea className="w-full h-full p-2.5">
          <DialogHeader>
            <DialogTitle className="my-2 text-2xl font-bold">
              {task?.id ? `Edit ${task.name}` : "Create Task"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form className="p-2.5" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input autoFocus placeholder="Task title" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={6}
                          placeholder="Describe the task here"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button className={cn(" mt-6", {})} type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEditTaskModal;
