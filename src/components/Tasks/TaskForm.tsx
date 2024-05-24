import { CreateTaskBody, Task } from "@/types/task.types";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import { v4 as uuid } from "uuid";
import { storage } from "@/firebase/BaseConfig";
import DatePicker from "react-datepicker";

import { Button } from "@/ui/button";
import { Label } from "@/ui/label";

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
import { add } from "date-fns/add";
import { AppUserProfile } from "@/types/user.types";
import useUsersMap from "@/hooks/useUsersMap";
import { round } from "@/lib/round";
import { Checkbox } from "@/ui/checkbox";

interface Props {
  task?: Task;
  projectId: string;
  sprintId?: string;
  columnId?: string;
  onSubmit: (sprint: CreateTaskBody & { filesToRemove?: string[] }) => void;
  submitRes: UseMutationResult<Task>;
  userId: string;
  memberOptions: AppUserProfile[];
}

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  storyPoint: z.coerce.number().min(0).max(5).default(1),
  dueDate: z.string(),
  createdBy: z.string(),
  projectId: z.string({ message: "Please select a project" }),
  assignees: z.array(z.string()),
  columnId: z.string().optional(),
  fileUrls: z.array(z.string()).max(10),
  filesToRemove: z.array(z.string()),
});

type Schema = z.infer<typeof formSchema>;

const defaultValues: Schema = {
  name: "",
  description: "",
  dueDate: add(new Date(), { days: 7 }).toISOString(),
  createdBy: "",
  storyPoint: 1,
  projectId: "",
  assignees: [],
  fileUrls: [],
  columnId: "",
  filesToRemove: [],
};

const uploadFile = async (file: File) => {
  const storageRef = ref(storage, `/attachments/${uuid()}-${file.name}`);

  const response = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(response.ref);
  return url;
};

const TaskForm = ({
  task,
  projectId,
  sprintId,
  columnId,
  onSubmit,
  submitRes,
  userId,
  memberOptions = [],
}: Props) => {
  const form = useForm<Schema>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [files, setFiles] = useState<File[]>([]);

  const filesToDel = form.watch("filesToRemove");

  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      multiple: true,
      maxFiles: 10 - filesToDel.length,
      onDrop: (acceptedFiles, fileRejections) => {
        const maxFileSize = 10 * 1048576; //10mb

        let list = acceptedFiles;

        const totalSize = acceptedFiles.reduce((sum, f) => (sum += f.size), 0);

        if (totalSize > maxFileSize) {
          toast.error(
            `Max size is 10MB. Uploaded size is ${round(
              totalSize / 1048576,
              2
            )}MB `
          );

          list = [];
        }

        if (fileRejections.length) {
          let msg = "";

          fileRejections?.[0]?.errors?.forEach((c) => {
            msg += `${c.message}.`;
          });

          if (msg) {
            toast.error("Error(s): " + msg);
            list = [];
          }
        }

        setFiles(list);
      },
    });

  const { userMap } = useUsersMap({ users: memberOptions });

  const handleSubmit = async (values: Schema) => {
    try {
      if (files.length) {
        toast.dismiss();
        toast.loading("Uploading file(s)...");
        const filePromises = Array.from(files, (file) => uploadFile(file));

        const urls = await Promise.all(filePromises);
        toast.dismiss();

        values.fileUrls = urls;
        onSubmit(values as unknown as CreateTaskBody);
      } else {
        onSubmit(values as unknown as CreateTaskBody);
      }
    } catch (error: any) {
      toast.error(error?.message || "Unable to upload file(s)");
    }
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
          columnId,
        });
      }
    }
  }, [userId, task, form, projectId, sprintId, columnId]);

  return (
    <Form {...form}>
      <form
        className="p-4 mx-auto bg-white"
        onSubmit={form.handleSubmit(handleSubmit, handleErrors)}
      >
        <h1 className="my-3 text-3xl font-bold text-center">
          {task?.id ? "Edit Task" : "Create Task"}
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

          <FormField
            control={form.control}
            name="assignees"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assignees</FormLabel>
                <MultiSelector
                  onValuesChange={field.onChange}
                  values={field.value}
                >
                  <MultiSelectorTrigger
                    displayValue={(val) => (
                      <span className="text-xs">{userMap[val]?.name}</span>
                    )}
                  >
                    <MultiSelectorInput placeholder="Select users" />
                  </MultiSelectorTrigger>
                  <MultiSelectorContent>
                    <MultiSelectorList className="flex-row flex-wrap">
                      {memberOptions.map((m) => (
                        <MultiSelectorItem
                          className="inline-flex mx-1"
                          key={m.id}
                          value={m.id}
                        >
                          {m.name}
                        </MultiSelectorItem>
                      ))}
                    </MultiSelectorList>
                  </MultiSelectorContent>
                </MultiSelector>
              </FormItem>
            )}
          />

          {/* FILES TO ADD */}
          <div className="grid gap-2 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Attached Files</Label>
              <div
                className={cn(
                  "text-center border-dashed rounded-lg p-2 border text-c5-300 h-32",
                  {
                    "border-destructive": isDragReject,
                    "border-primary": isDragAccept,
                  }
                )}
              >
                <div className="h-full center" {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p>
                    Choose files.{" "}
                    {`Max of ${
                      10 - filesToDel.length
                    } files . Total size <=10MB`}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>File List</Label>
              <ul className="space-y-1.5 list-disc">
                {files.map((a, i) => (
                  <li key={i} className="mx-1 text-xs font-medium">
                    {a.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* FILES TO REMOVE */}
          {task?.id ? (
            <FormField
              control={form.control}
              name="filesToRemove"
              render={() => (
                <FormItem>
                  <FormLabel>Files to remove</FormLabel>
                  <div>
                    {task?.fileUrls?.map((f) => (
                      <FormField
                        key={f}
                        control={form.control}
                        name="filesToRemove"
                        render={({ field }) => (
                          <FormItem
                            key={f}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(f)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, f])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== f
                                        )
                                      );
                                }}
                              />
                              <FormLabel className="text-sm font-normal">
                                {f}
                              </FormLabel>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />
          ) : (
            <></>
          )}

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
