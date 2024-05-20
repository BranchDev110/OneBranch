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

import { Dialog, DialogContent, DialogTrigger } from "@/ui/dialog";
import { Button } from "@/ui/button";
import { ScrollArea } from "@/ui/scroll-area";
import { useMemo } from "react";
import { CalendarIcon, ClockIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { format } from "date-fns/format";
import { isValid } from "date-fns/isValid";
import TeamIcon from "@/icons/TeamIcon";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { useGetUsersInProjectQuery } from "@/services/users";
import { Progress } from "@/ui/progress";
import { toast } from "sonner";

const ProjectDetails = () => {
  const { id } = useParams();
  const [edit, editRes] = useEditProjectMutation();

  const {
    data: project,
    isLoading: projectLoading,
    isSuccess: projectSuccess,
    isError: projectError,
  } = useGetProjectQuery(id as string, { skip: !id });
  const {
    data: columns = [],
    isLoading: colLoading,
    isSuccess: colSuccess,
    isError: colError,
  } = useGetProjectColumnsQuery(id as string, {
    skip: !id,
  });

  const {
    data: team = [],
    isLoading: teamLoading,
    isSuccess: teamSuccess,
    isError: teamError,
  } = useGetUsersInProjectQuery(project?.members as string[], {
    skip: !project?.members?.length,
  });

  const onSubmit = (values: any) => {
    console.log(values);
    toast.dismiss();
    toast.loading("coming soon...");
  };
  // console.log({ columns, project, team });

  const isLoading = colLoading || projectLoading || teamLoading;
  const isSuccess = colSuccess && projectSuccess && teamSuccess;
  const isError = colError || projectError || teamError;

  const orderedColumns = useMemo(() => {
    if (project?.columns?.length && columns?.length) {
      return [...columns].sort((a, b) => {
        return project.columns.indexOf(a.id) - project.columns.indexOf(b.id);
      });
    }

    return [];
  }, [columns, project?.columns]);

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
        <div className="grid gap-2 grid-cols-[minmax(0,1fr)_minmax(50px,0.35fr)] p-4">
          <div className="px-4">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">{project?.name}</h1>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="space-x-2 rounded-sm h-unset">
                    <Pencil1Icon /> <span>Edit Project</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl h-[80vh]">
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
            </div>
            <div className="grid gap-6">
              <div>
                <h2 className="mb-2 text-lg font-semibold">Project Details</h2>
                <div className="grid gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="text-gray-500 " />
                    <span className="text-gray-500 ">
                      Started on{" "}
                      {isValid(new Date(project?.startDate as string))
                        ? format(
                            new Date(project?.startDate as string),
                            "LLLL dd, yyyy"
                          )
                        : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="text-gray-500 " />
                    <span className="text-gray-500 ">
                      Ends on{" "}
                      {isValid(new Date(project?.endDate as string))
                        ? format(
                            new Date(project?.endDate as string),
                            "LLLL dd, yyyy"
                          )
                        : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TeamIcon className="text-gray-500 " />
                    <span className="text-gray-500 ">
                      {team?.length} team member{team?.length > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="mb-2 text-lg font-semibold">
                  Project Description
                </h2>
                <div className="text-sm text-gray-500 whitespace-pre-line ">
                  <p>{project?.description}</p>
                </div>
              </div>

              <div>
                <h2 className="mb-2 text-lg font-semibold">Project Columns</h2>

                <ol className="max-w-md space-y-1 text-gray-500 list-decimal list-inside">
                  {orderedColumns.map((col) => (
                    <li key={col.id}>{col.name}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="sticky top-0 p-4 rounded-lg bg-c2-100/50">
              <h2 className="mb-4 text-lg font-semibold">Project Team</h2>

              <div className="grid gap-4">
                {team.map((t) => (
                  <div key={t.id} className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage alt="Sofia Davis" src={t.avatarUrl} />
                      <AvatarFallback>{t.name[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{t.name}</p>
                      <p className="text-sm text-gray-500 capitalize ">
                        {t.role?.toLowerCase()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CaseRender>
    </div>
  );
};

export default ProjectDetails;
