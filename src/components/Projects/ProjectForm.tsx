import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import DatePicker from "react-datepicker";
import { add } from "date-fns/add";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import { v4 as uuid } from "uuid";
import { storage } from "@/firebase/BaseConfig";

import { cn } from "@/lib/utils";

import { UseMutationResult } from "@/types/rtk.types";

import {
  Project,
  ProjectColumn,
  CreateProjectBody,
} from "@/types/project.types";

import DeleteIcon from "@/icons/DeleteIcon";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Textarea } from "@/ui/textarea";
import { Label } from "@/ui/label";

type ProjectArgs = { id?: string } & CreateProjectBody;

interface Props {
  project?: Omit<Project, "columns">;
  adminId: string;
  onSubmit: (project: ProjectArgs) => void;
  submitRes: UseMutationResult<Project>;
  columns?: ProjectColumn[];
}

const formSchema = z.object({
  name: z.string().min(3),
  description: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  admin: z.string(),
  members: z.string().array().optional().default([]),
  currentPoints: z.number().nonnegative().optional().default(0),
  totalPoints: z.number().nonnegative().optional().default(0),
  columns: z
    .array(
      z.object({
        id: z.string().optional().default("new"),
        name: z.string().min(1),
      })
    )
    .min(1)
    .max(10)
    .default([]),
  imageUrl: z.string().default(""),
});

type Schema = z.infer<typeof formSchema>;

const defaultValues: Schema = {
  name: "",
  description: "",
  startDate: new Date().toISOString(),
  endDate: add(new Date(), { days: 21 }).toISOString(),
  admin: "",
  members: [],
  currentPoints: 0,
  totalPoints: 0,
  columns: [],
  imageUrl: "",
};

const maxFileSize = 1048576; //1mb

const ProjectForm = ({
  project,
  submitRes,
  onSubmit,
  adminId,
  columns = [],
}: Props) => {
  const form = useForm<Schema>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const {
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragReject,
    acceptedFiles,
  } = useDropzone({
    multiple: false,
    accept: {
      "image/*": [],
    },
    maxSize: maxFileSize,

    onDrop: (_acceptedFiles, fileRejections) => {
      //   console.log({ acceptedFiles, fileRejections });
      //   console.log(fileRejections?.[0]?.errors);
      if (fileRejections.length) {
        let msg = "";

        fileRejections?.[0]?.errors?.forEach((c) => {
          msg += `${c.message}.`;
        });

        if (msg) {
          toast.error("Error(s): " + msg);
        }
      }
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "columns",
  });

  const handleSubmit = async (values: Schema) => {
    try {
      if (acceptedFiles.length) {
        const storageRef = ref(
          storage,
          `/projects/${uuid()}-${acceptedFiles[0].name}`
        );

        toast.dismiss();
        toast.loading("Uploading image...");

        const snapshot = await uploadBytes(storageRef, acceptedFiles[0]);

        const url = await getDownloadURL(snapshot.ref);

        toast.dismiss();

        values.imageUrl = url;
        onSubmit(values);
      } else {
        onSubmit(values);
      }
    } catch (error: any) {
      toast.error(error?.message || "Unable to set project cover image");
    }
  };

  useEffect(() => {
    if (project) {
      if (!form.getValues().columns.length) {
        form.reset({
          ...project,
          columns,
        });
      }
    } else {
      if (!form.getValues().admin) {
        form.reset({
          ...defaultValues,
          startDate: new Date().toISOString(),
          endDate: add(new Date(), { days: 21 }).toISOString(),
          admin: adminId,
          members: [adminId],
        });
      }
    }
  }, [adminId, project, form, columns]);

  const handleErrors = (...args: any) => {
    console.log(args);
  };

  const cols = form.watch("columns");

  return (
    <Form {...form}>
      <form
        className="p-2 mx-auto bg-white md:p-4"
        onSubmit={form.handleSubmit(handleSubmit, handleErrors)}
      >
        <h1 className="my-3 text-2xl font-bold text-center md:text-3xl">
          {project?.id ? "Edit project" : "Create a new project"}
        </h1>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input autoFocus placeholder="Project Name" {...field} />
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
                <FormLabel>Project Description</FormLabel>
                <FormControl>
                  <Textarea
                    rows={6}
                    placeholder="Tell us a little bit about the project"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <Label htmlFor="upload-image">Project Image</Label>
            <div
              className={cn(
                "text-center border-dashed rounded-lg p-2 border text-c5-300 h-24",
                {
                  "border-destructive": isDragReject,
                  "border-primary": isDragAccept,
                }
              )}
            >
              <div className="h-full center" {...getRootProps()}>
                <input
                  data-testid="upload-image"
                  id="upload-image"
                  {...getInputProps()}
                />
                <p>Upload an image file. {"(<=1MB)"}</p>
              </div>
            </div>
          </div>

          {project?.imageUrl || acceptedFiles.length ? (
            <div className="relative w-12 mx-auto overflow-hidden border-2 rounded-full aspect-square border-primary">
              <img
                className="absolute object-cover object-center w-full h-full"
                src={
                  acceptedFiles?.[0]
                    ? URL.createObjectURL(acceptedFiles?.[0])
                    : project?.imageUrl
                }
              />
            </div>
          ) : (
            <></>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="[&_.react-datepicker-wrapper]:block [&_.react-datepicker-wrapper_input]:date-input">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
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

            <div className="[&_.react-datepicker-wrapper]:block [&_.react-datepicker-wrapper_input]:date-input">
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
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

          {form?.formState?.errors?.columns?.message ? (
            <small className="text-[0.8rem]  text-destructive italic block">
              {form?.formState?.errors?.columns?.message}
            </small>
          ) : (
            <></>
          )}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
            {fields.map((field, index) => (
              <div key={field.id} className="relative space-y-2">
                <Input
                  {...form.register(`columns.${index}.name` as const)}
                  className="pr-10"
                  data-testid={`Column ${index + 1}`}
                  placeholder={`Column ${index + 1}`}
                />
                <small className="text-[0.8rem] text-destructive italic block">
                  {form?.formState?.errors?.columns?.[index]?.name?.message}
                </small>

                {cols?.[index]?.id === "new" ? (
                  <Button
                    className="absolute top-0 p-1 right-1 h-unset w-unset"
                    onClick={() => remove(index)}
                    variant={"destructive"}
                    size={"icon"}
                  >
                    <DeleteIcon />
                  </Button>
                ) : (
                  <></>
                )}
              </div>
            ))}

            <Button
              type="button"
              onClick={() => append({ id: "new", name: "" })}
              className=""
              variant={"outline"}
            >
              Add column
            </Button>
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

export default ProjectForm;
