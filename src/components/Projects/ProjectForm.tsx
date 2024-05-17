import React from "react";

import { Project } from "@/types/project.types";

interface Props {
  project?: Project;
  onSubmit?: () => void;
  submitRes?: any;
}

const ProjectForm = ({ project }: Props) => {
  return <div>ProjectForm</div>;
};

export default ProjectForm;
