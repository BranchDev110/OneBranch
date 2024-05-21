import { ReactNode } from "react";
import CaseRender from "./CaseRender";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface Props {
  show: boolean;
  message?: ReactNode;
}

const ErrorComponent = ({ show, message }: Props) => {
  return (
    <CaseRender condition={show}>
      <Alert variant="destructive">
        <ExclamationTriangleIcon className="w-4 h-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {message ? message : <p>Oops, something went wrong.</p>}
        </AlertDescription>
      </Alert>
    </CaseRender>
  );
};

export default ErrorComponent;
