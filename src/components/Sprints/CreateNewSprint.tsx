import SprintForm from "@/components/Sprints/SprintForm";
import { Dialog, DialogContent, DialogTrigger } from "@/ui/dialog";
import { Button } from "@/ui/button";
import { ScrollArea } from "@/ui/scroll-area";
import { UserProfile } from "@/types/user.types";
import { useCreateSprintMutation } from "@/services/sprints";
import { CreateSprintBody } from "@/types/sprint.types";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useGetUsersProjectsQuery } from "@/services/projects";
import LoadingComponent from "../LoadingComponent";
import ErrorComponent from "../ErrorComponent";
import CaseRender from "../CaseRender";

interface Props {
  user: UserProfile;
}

const CreateNewSprint = ({ user }: Props) => {
  const navigate = useNavigate();

  const [createSprint, createRes] = useCreateSprintMutation();

  const {
    data: projects = [],
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersProjectsQuery(user!.id as string, {
    skip: !user?.id,
  });

  const onCreateSprint = async (values: CreateSprintBody) => {
    // console.log(values);

    toast.dismiss();
    toast.loading("Creating sprint...");
    try {
      const res = await createSprint(values).unwrap();
      toast.dismiss();
      toast.success("Created sprint");

      navigate(`/sprints/${res.id}`);
    } catch (error: any) {
      toast.dismiss();

      const msg = error?.message || "Unable to create sprint for project";
      toast.error(msg);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="block w-full pl-2 font-normal text-start h-unset"
        >
          + New Sprint
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl pt-10 px-8 h-[80vh]">
        <ScrollArea className="h-full">
          <LoadingComponent show={isLoading} />
          <ErrorComponent
            show={isError}
            message={
              <code className="block w-full">
                <pre className="max-w-full text-sm break-all whitespace-break-spaces ">
                  {JSON.stringify(error, null, 2)}
                </pre>
              </code>
            }
          />

          <CaseRender condition={isSuccess}>
            <SprintForm
              userId={user!.id as string}
              submitRes={createRes}
              onSubmit={onCreateSprint}
              projectList={projects}
            />
          </CaseRender>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewSprint;
