import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DatePicker from "react-datepicker";
import { add } from "date-fns/add";

import { cn } from "@/lib/utils";

import { Sprint } from "@/types/sprint.types";
import { UseMutationResult } from "@/types/rtk.types";

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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Textarea } from "@/ui/textarea";
import { Label } from "@/ui/label";
import { PartialBy } from "@/types/generic.types";
import { CheckIcon, TriangleDownIcon } from "@radix-ui/react-icons";
import { CommandList } from "cmdk";

interface Props {
  sprint?: Sprint;
  projectId?: string;
  userId: string;
  projectList: { id: string; name: string }[];
  onSubmit: (sprint: PartialBy<Sprint, "id">) => void;
  submitRes: UseMutationResult<Sprint>;
}

const formSchema = z.object({
  name: z.string().min(3),
  description: z.string(),
  endDate: z.string(),
  startDate: z.string(),
  createdBy: z.string(),
  projectId: z.string(),
  currentPoints: z.number().nonnegative().optional().default(0),
  totalPoints: z.number().nonnegative().optional().default(0),
});

type Schema = z.infer<typeof formSchema>;

const defaultValues: Schema = {
  name: "",
  description: "",
  endDate: add(new Date(), { days: 21 }).toISOString(),
  startDate: new Date().toISOString(),
  createdBy: "",
  currentPoints: 0,
  totalPoints: 0,
  projectId: "",
};

const SprintForm = ({
  userId,
  projectId,
  onSubmit,
  submitRes,
  sprint,
  projectList = [],
}: Props) => {
  const [open, setOpen] = useState(false);

  const form = useForm<Schema>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const selectedProject = form.watch("projectId");

  const handleSubmit = async (values: Schema) => {
    onSubmit(values);
  };

  const handleErrors = (...args: any) => {
    console.log(args);
  };

  useEffect(() => {
    if (sprint) {
      if (!form.getValues().projectId) {
        form.reset(sprint);
      }
    } else {
      if (!form.getValues().projectId) {
        form.reset({
          ...defaultValues,
          endDate: add(new Date(), { days: 21 }).toISOString(),
          projectId,
          createdBy: userId,
        });
      }
    }
  }, [userId, sprint, form, projectId]);

  return (
    <Form {...form}>
      <form
        className="p-4 mx-auto bg-white"
        onSubmit={form.handleSubmit(handleSubmit, handleErrors)}
      >
        <h1 className="my-3 text-3xl font-bold text-center">
          {sprint?.id ? "Edit sprint" : "Create a new sprint"}
        </h1>

        <div className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sprint Name</FormLabel>
                <FormControl>
                  <Input autoFocus placeholder="Sprint Name" {...field} />
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
                <FormLabel>Sprint Description</FormLabel>
                <FormControl>
                  <Textarea
                    rows={6}
                    placeholder="Describe the sprint"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="[&_.react-datepicker-wrapper]:block [&_.react-datepicker-wrapper_input]:date-input">
              <FormField
                control={form.control}
                name="startDate"
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

          {!projectId ? (
            <div className="space-y-2">
              <Popover open={open} onOpenChange={setOpen}>
                <Label className="block">Choose Project</Label>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                  >
                    {selectedProject
                      ? projectList?.find((p) => p.id === selectedProject)?.name
                      : "Select project..."}
                    <TriangleDownIcon className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search project..." />

                    <CommandEmpty>No project found.</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {projectList?.map((p) => (
                          <CommandItem
                            key={p.id}
                            value={p.id}
                            onSelect={(val) => {
                              form.setValue("projectId", val);
                              setOpen(false);
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                "mr-2 h-4 w-4",
                                p.id === selectedProject
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {p.name}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Project</Label>
              <Input
                className="cursor-not-allowed pointer-events-none"
                disabled
                value={projectList?.[0]?.name}
              />
            </div>
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

export default SprintForm;
