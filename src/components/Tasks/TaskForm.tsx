import { Task } from "@/types/task.types";
import { ReactNode, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { PlusIcon } from "@radix-ui/react-icons";
import DatePicker from "react-datepicker";

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

import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/ui/multi-select";

import { Textarea } from "@/ui/textarea";
import { cn } from "@/lib/utils";
import { UseMutationResult } from "@/types/rtk.types";
import { PartialBy } from "@/types/generic.types";
import { TASK_STATUS } from "@/constants/task-status";
import { add } from "date-fns/add";

interface Props {
  task?: Task;
  projectId: string;
  sprintId?: string;
  columnId?: string;
  onSubmit: (sprint: PartialBy<Task, "id">) => void;
  submitRes: UseMutationResult<Task>;
  userId: string;
}

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  storyPoint: z.number().min(0).max(5),
  dueDate: z.string(),
  createdBy: z.string(),
  projectId: z.string({ message: "Please select a project" }),
  assignees: z.array(z.string()),
});

type Schema = z.infer<typeof formSchema>;

const defaultValues: Schema = {
  name: "",
  description: "",
  dueDate: add(new Date(), { days: 7 }).toISOString(),
  createdBy: "",
  storyPoint: 0,
  projectId: "",
  assignees: [],
};

const TaskForm = ({
  task,
  projectId,
  sprintId,
  columnId,
  onSubmit,
  submitRes,
  userId,
}: Props) => {
  const form = useForm<Schema>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = async (values: Schema) => {
    onSubmit(values);
  };

  const handleErrors = (...args: any) => {
    console.log(args);
  };

  useEffect(() => {
    if (task) {
      if (!form.getValues().projectId) {
        form.reset(task);
      }
    } else {
      if (!form.getValues().projectId) {
        form.reset({
          ...defaultValues,
          dueDate: add(new Date(), { days: 7 }).toISOString(),
          projectId,
          createdBy: userId,
        });
      }
    }
  }, [userId, task, form, projectId, sprintId]);

  return (
    <Form {...form}>
      <form
        className="p-4 mx-auto bg-white"
        onSubmit={form.handleSubmit(handleSubmit, handleErrors)}
      >
        <h1 className="my-3 text-3xl font-bold text-center">
          {task?.id ? "Edit task" : "Create a new task"}
        </h1>

        <div className="space-y-6">
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

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="storyPoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Story Point</FormLabel>
                  <FormControl>
                    <Input
                      max={5}
                      min={0}
                      type="number"
                      inputMode="numeric"
                      placeholder="5"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="[&_.react-datepicker-wrapper]:block [&_.react-datepicker-wrapper_input]:date-input">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          dateFormat="yyyy-MM-dd"
                          selected={new Date(field.value)}
                          onChange={(d: Date) =>
                            form.setValue(field.name, d.toISOString())
                          }
                        />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              disabled={submitRes.isLoading}
              className={cn("", {
                "animate-pulse cursor-not-allowed": submitRes.isLoading,
              })}
              type="submit"
            >
              Submit
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default TaskForm;
