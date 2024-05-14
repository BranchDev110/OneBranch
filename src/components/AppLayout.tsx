import { Outlet } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

const AppLayout = () => {
  return (
    <ProtectedRoute>
      <div>
        {/* SIDEBAR */}

        <main>
          <div>
            <Outlet />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default AppLayout;
