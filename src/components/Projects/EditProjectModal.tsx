import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/ui/dialog";
import { toast } from "sonner";

import {
  CreateProjectBody,
  EditProjectBody,
  Project,
  ProjectColumn,
} from "@/types/project.types";
import { useEditProjectMutation } from "@/services/projects";
import { AppUserProfile } from "@/types/user.types";
import { ROLES } from "@/constants/roles";
import differenceWith from "lodash/differenceWith";
import isEqual from "lodash/isEqual";
import useDeleteImagesFromFirebase from "@/hooks/useDeleteImagesFromFirebase";
import { Button } from "@/ui/button";
import { ScrollArea } from "@/ui/scroll-area";
import ProjectForm from "@/components/Projects/ProjectForm";

interface Props {
  user?: AppUserProfile;
  project: Project;
  orderedColumns: ProjectColumn[];
  columns: ProjectColumn[];
  closeModal?: (val: boolean) => void;
}

const EditProjectModal = ({
  user,
  project,
  orderedColumns,
  columns,
  closeModal,
}: Props) => {
  const [open, setOpen] = useState(false);

  const [edit, editRes] = useEditProjectMutation();

  const { handleDelete } = useDeleteImagesFromFirebase();

  const onSubmit = async (values: CreateProjectBody) => {
    // console.log(values);
    toast.dismiss();
    toast.loading("Editing project...");

    try {
      const newColumns = values.columns.filter((c) => c.id === "new");
      const oldColumns = values.columns.filter((c) => c.id !== "new");

      const oldUrl = project?.imageUrl;

      const diff = differenceWith(oldColumns, columns, isEqual);

      const body: EditProjectBody = {
        ...values,
        id: project.id,
        oldColumns: diff,
        newColumns,
        imageUrl: values.imageUrl || project?.imageUrl || "",
      };
      // console.log(body);
      await edit(body).unwrap();

      toast.dismiss();
      toast.success("Edited project");
      setOpen(false);

      if (oldUrl && oldUrl !== body?.imageUrl) {
        handleDelete([oldUrl]);
      }
    } catch (error: any) {
      toast.dismiss();

      const msg = error?.message || "Unable to edit project";
      toast.error(msg);
    }
  };

  const handleOpenChange = (val: boolean) => {
    setOpen(val);

    if (!val) {
      closeModal && closeModal(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        disabled={user?.role !== ROLES.ADMIN || project?.admin !== user?.id}
        asChild
      >
        <Button
          variant={"ghost"}
          className="block w-full pl-2 font-normal text-start h-unset"
        >
          <span>Edit Project</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-11/12 pt-10 px-2 md:px-8 rounded-md h-[80vh]">
        <ScrollArea className="h-full">
          <ProjectForm
            submitRes={editRes}
            onSubmit={onSubmit}
            adminId={project?.admin as string}
            project={project}
            columns={orderedColumns}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectModal;
