import { ComponentProps } from "react";
import CaseRender from "./CaseRender";
import { cn } from "@/lib/utils";
import SpinnerIcon from "@/icons/SpinnerIcon";

interface Props extends Omit<ComponentProps<"div">, "children"> {
  show: boolean;
}

const LoadingComponent = ({ show, className = "", ...props }: Props) => {
  return (
    <CaseRender condition={show}>
      <div className={cn("center min-h-[30vh]", className)} {...props}>
        <SpinnerIcon className="w-12 h-12 stroke-c2-100" />
      </div>
    </CaseRender>
  );
};

export default LoadingComponent;
