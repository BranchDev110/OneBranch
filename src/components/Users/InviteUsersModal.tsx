import { Dialog, DialogContent, DialogTrigger } from "@/ui/dialog";
import InviteUsersForm, {
  Props as InviteProps,
} from "../Users/InviteUsersForm";
import { ScrollArea } from "@/ui/scroll-area";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/ui/button";
import { useState } from "react";

interface Props extends InviteProps {
  disabled: boolean;
  renderInviteButton?: () => React.ReactNode;
}

const InviteUsersModal = ({
  taskId,
  projectId,
  projectName,
  adminName,
  disabled,
  invitedBy,
  renderInviteButton,
}: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {renderInviteButton ? (
          <span>{renderInviteButton()}</span>
        ) : (
          <Button
            disabled={disabled}
            className="text-c5-400 disabled:cursor-not-allowed"
            variant="ghost"
            size={"icon"}
          >
            <PlusCircledIcon className="w-7 h-7" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-10/12 md:w-3/4 max-w-xl pt-10 px-2 md:px-8 h-[70vh] rounded-md">
        <ScrollArea className="h-full">
          <InviteUsersForm
            invitedBy={invitedBy}
            onSuccessCallback={() => setOpen(false)}
            projectName={projectName}
            adminName={adminName}
            taskId={taskId}
            projectId={projectId}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUsersModal;
