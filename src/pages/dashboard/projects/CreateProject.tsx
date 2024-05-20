import AppHeaderNav from "@/components/AppHeaderNav";
import ProjectForm from "@/components/Projects/ProjectForm";
import useLoggedInUser from "@/hooks/useLoggedInUser";
import { useCreateProjectMutation } from "@/services/projects";
import { CreateProjectBody } from "@/types/project.types";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CreateProject = () => {
  const { user } = useLoggedInUser();

  const [make, res] = useCreateProjectMutation();
  const navigate = useNavigate();

  const handleCreate = async (values: CreateProjectBody) => {
    try {
      // console.log(values);
      toast.dismiss();
      toast.loading("Creating project...");

      const res = await make(values).unwrap();

      toast.dismiss();
      toast.success("Created project");

      navigate(`/projects/${res.id}`);
    } catch (error: any) {
      toast.dismiss();

      const msg = error?.message || "Unable to create project";
      toast.error(msg);
    }
  };

  return (
    <div className="">
      <AppHeaderNav>
        <NavLink className={"font-medium text-c5-300"} to={"/projects"}>
          Back
        </NavLink>{" "}
      </AppHeaderNav>

      <div className="p-4">
        <ProjectForm
          onSubmit={handleCreate}
          submitRes={res}
          adminId={user?.id as string}
        />
      </div>
    </div>
  );
};

export default CreateProject;
