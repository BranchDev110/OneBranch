import { Sprint } from "@/types/sprint.types";
import { useId, useState } from "react";
import { Input } from "@/ui/input";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "@/ui/dialog";
import { Button } from "@/ui/button";
import { ScrollArea } from "@/ui/scroll-area";
import { AppUserProfile } from "@/types/user.types";
import { ROLES } from "@/constants/roles";
import { Label } from "@/ui/label";
import { useDeleteSprintMutation } from "@/services/sprints";
import { cn } from "@/lib/utils";

interface Props {
  sprint: Sprint;
  user: AppUserProfile;
  closeModal?: (val: boolean) => void;
}

const DeleteSprintModal = ({ sprint, closeModal, user }: Props) => {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const [deleteSprint, deleteRes] = useDeleteSprintMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
  };

  const handleOpenChange = (val: boolean) => {
    setOpen(val);

    if (!val) {
      closeModal && closeModal(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    toast.dismiss();
    toast.loading("Deleteing sprint...");

    try {
      await deleteSprint(sprint.id).unwrap();
      toast.dismiss();
      toast.success("Deleted Sprint");
      handleOpenChange(false);
    } catch (error: any) {
      toast.dismiss();

      const msg = error?.message || "Unable to delete sprint";
      toast.error(msg);
    }
  };

  const disableDelete = () => {
    if (user?.role === ROLES.ADMIN) {
      return false;
    }

    if (sprint.createdBy === user?.id) {
      return false;
    }

    return true;
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger disabled={disableDelete()} asChild>
        <Button
          variant={"ghost"}
          className="block w-full pl-2 font-normal text-start h-unset"
        >
          <span>Delete Sprint</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl rounded-md w-11/12 pt-10 px-2 md:px-8 h-[50vh]">
        <ScrollArea className="h-full">
          <form onSubmit={onSubmit} className="p-4 mx-auto bg-white">
            <h1 className="my-3 text-3xl font-bold text-center">
              Delete Sprint?
            </h1>

            <h3 className="my-2 text-lg">
              Sprint Title : <strong>{sprint.name}</strong>
            </h3>

            <div className="mt-4 space-y-2">
              <Label htmlFor={id}>Type Title</Label>
              <Input
                id={id}
                autoFocus
                placeholder="Sprint title"
                value={name}
                onChange={handleChange}
                data-testid="Type Title"
              />
            </div>

            <div className="flex justify-end gap-2 mt-3">
              <Button
                variant={"destructive"}
                disabled={deleteRes.isLoading || name !== sprint.name}
                className={cn("", {
                  "animate-pulse cursor-not-allowed": deleteRes.isLoading,
                })}
                type="submit"
              >
                Submit
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteSprintModal;
