import ProjectForm from "@/components/Projects/ProjectForm";
import useLoggedInUser from "@/hooks/useLoggedInUser";
import {
  useCreateProjectMutation,
  useGetUsersProjectsQuery,
} from "@/services/projects";
import { CreateProjectBody } from "@/types/project.types";
import { Button } from "@/ui/button";
import React from "react";

const CreateProject = () => {
  const { user } = useLoggedInUser();

  const [make] = useCreateProjectMutation();

  const { data = [] } = useGetUsersProjectsQuery(user!.id, { skip: !user?.id });

  const handleCreate = async () => {
    const body: CreateProjectBody = {
      name: "Fake",
      description: "test project",
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      admin: user?.id as string,
      members: [user?.id as string],
      currentPoints: 0,
      totalPoints: 0,
      columns: ["design", "wireframe", "build"],
      imageUrl: "",
    };

    await make(body).unwrap();
  };

  return (
    <div className="grid grid-cols-2 p-4">
      <Button onClick={handleCreate}>Fake Create Project</Button>

      <div>
        {data.map((p) => (
          <p>{p.name}</p>
        ))}
      </div>

      <ProjectForm />
    </div>
  );
};

export default CreateProject;
