import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";

import { cn } from "@/lib/utils";
import { useSendInvitationToUsersMutation } from "@/services/projects";
import { SendInviteArgs } from "@/types/project.types";
import { toast } from "sonner";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import DeleteIcon from "@/icons/DeleteIcon";

export interface Props {
  projectId: string;
  taskId?: string;
  projectName: string;
  adminName: string;
  invitedBy: string;
  onSuccessCallback?: () => void;
}

const formSchema = z.object({
  emails: z
    .array(
      z.object({
        val: z.string().email(),
      })
    )
    .min(1)
    .max(10),
});

type Schema = z.infer<typeof formSchema>;

const defaultValues: Schema = {
  emails: [{ val: "" }],
};

const InviteUsersForm = ({
  projectId,
  invitedBy,
  projectName,
  adminName,
  taskId,
  onSuccessCallback,
}: Props) => {
  const form = useForm<Schema>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [sendInvite, res] = useSendInvitationToUsersMutation();

  const handleSubmit = async (values: Schema) => {
    try {
      toast.dismiss();
      const id = toast.loading("Sending invitations...");
      const body: SendInviteArgs = {
        projectId,
        projectName,
        adminName,
        taskId,
        invitedBy,
        emails: values.emails.map((m) => m.val).filter((p) => p),
        originUrl: `${window.location.origin}/invitation`,
      };

      //   console.log({ body, values });

      await sendInvite(body).unwrap();
      toast.dismiss();
      toast.dismiss(id);
      toast.success("Invitations sent");

      onSuccessCallback && onSuccessCallback();
    } catch (error: any) {
      toast.dismiss();

      const msg = error?.message || "Unable to send invitations";
      toast.error(msg);
    }
  };

  const handleErrors = (...args: any) => {
    console.log(args);
  };

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "emails",
  });

  const emails = form.watch("emails");

  return (
    <Form {...form}>
      <form
        className="p-2.5 mx-auto bg-white md:p-4"
        onSubmit={form.handleSubmit(handleSubmit, handleErrors)}
      >
        <h1 className="my-3 text-3xl font-bold text-center">Invite Users</h1>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="relative space-y-2">
              <Input
                {...form.register(`emails.${index}.val` as const)}
                className="pr-10"
                placeholder={`Email ${index + 1}`}
                type="email"
                inputMode="email"
              />
              <small className="text-[0.6rem] text-destructive italic block">
                {form?.formState?.errors?.emails?.[index]?.val?.message}
              </small>

              <Button
                className="absolute top-0 p-1 right-1 h-unset w-unset"
                onClick={() => remove(index)}
                variant={"destructive"}
                size={"icon"}
              >
                <DeleteIcon />
              </Button>
            </div>
          ))}

          {emails.length < 10 ? (
            <Button
              type="button"
              onClick={() => append({ val: "" })}
              className=""
              variant={"outline"}
            >
              Add email
            </Button>
          ) : (
            <></>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button
            disabled={res.isLoading}
            className={cn("", {
              "animate-pulse cursor-not-allowed": res.isLoading,
            })}
            type="submit"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InviteUsersForm;
