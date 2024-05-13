import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const user = null;

  if (!user) return <Navigate to="/signin" />;

  return children;
};

export default ProtectedRoute;
