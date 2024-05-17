import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import useLoggedInUser from "@/hooks/useLoggedInUser";

const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { isLoading, user } = useLoggedInUser();

  if (isLoading) {
    return <></>;
  }

  if (!isLoading && user?.id) {
    return children;
  }

  return <Navigate to="/signin" />;
};

export default ProtectedRoute;
