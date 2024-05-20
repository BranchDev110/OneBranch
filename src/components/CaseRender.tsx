import { ReactNode } from "react";

interface CaseProps {
  condition: boolean | (() => boolean);
  children: ReactNode;
}

const CaseRender = ({ condition, children }: CaseProps) => {
  if (typeof condition === "boolean") {
    return condition ? <>{children}</> : null;
  }

  return condition() ? <>{children}</> : null;
};

export default CaseRender;
