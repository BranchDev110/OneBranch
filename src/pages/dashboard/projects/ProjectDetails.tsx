import AppHeaderNav from "@/components/AppHeaderNav";
import CaseRender from "@/components/CaseRender";
import ProjectForm from "@/components/Projects/ProjectForm";
import SpinnerIcon from "@/icons/SpinnerIcon";
import {
  useEditProjectMutation,
  useGetProjectColumnsQuery,
  useGetProjectQuery,
} from "@/services/projects";
import { NavLink, useParams } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";
import { Button } from "@/ui/button";

const ProjectDetails = () => {
  const { id } = useParams();
  const [edit, editRes] = useEditProjectMutation();

  const {
    data: project,
    isLoading: projectLoading,
    isSuccess: projectSuccess,
  } = useGetProjectQuery(id as string, { skip: !id });
  const {
    data: columns = [],
    isLoading: colLoading,
    isSuccess: colSuccess,
  } = useGetProjectColumnsQuery(id as string, {
    skip: !id,
  });

  const onSubmit = (values: any) => {
    console.log(values);
  };
  // console.log({ columns, project });

  const isLoading = colLoading || projectLoading;
  const isSuccess = colSuccess && projectSuccess;

  const orderedColumns = [];

  return (
    <div className="">
      <AppHeaderNav>
        <NavLink className={"font-medium text-c5-300"} to={"/projects"}>
          Back
        </NavLink>
      </AppHeaderNav>

      <CaseRender condition={isLoading}>
        <div className="center">
          <SpinnerIcon className="w-12 h-12 stroke-c2-100" />
        </div>
      </CaseRender>

      <CaseRender condition={isSuccess}>
        <Dialog>
          <div className="grid gap-2 grid-cols-[minmax(0,1fr)_minmax(50px,0.35fr)] p-4">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">{project?.name}</h1>
              <DialogTrigger asChild>
                <Button className="space-x-2 rounded-xl h-unset">
                  Edit Project
                </Button>
              </DialogTrigger>
            </div>
            <div className="p-2 rounded-lg bg-c2-100">PROJECT MEMBERS</div>
          </div>

          <DialogContent className="max-w-2xl h-[80vh]">
            <ProjectForm
              submitRes={editRes}
              onSubmit={onSubmit}
              adminId={project?.admin as string}
              project={project}
              columns={orderedColumns}
            />
          </DialogContent>
        </Dialog>
      </CaseRender>
    </div>
  );
};

export default ProjectDetails;
