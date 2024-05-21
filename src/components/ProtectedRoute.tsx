import { PropsWithChildren } from "react";
import {
  Navigate,
  // , useLocation
} from "react-router-dom";
import useLoggedInUser from "@/hooks/useLoggedInUser";

const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { isLoading, user } = useLoggedInUser();
  // const location = useLocation();
  // console.log(`${location.pathname}?${location.search}`);

  if (isLoading) {
    return <></>;
  }

  if (!isLoading && user?.id) {
    return children;
  }

  return <Navigate to="/signin" />;
};

export default ProtectedRoute;
