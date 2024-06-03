import { ReactNode } from "react";

interface CaseProps {
  condition: boolean | (() => boolean);
  children: ReactNode;
}

const CaseRender = ({ condition, children }: CaseProps) => {
  if (typeof condition === "boolean") {
    return condition ? <>{children}</> : <></>;
  }

  return condition() ? <>{children}</> : <></>;
};

export default CaseRender;
