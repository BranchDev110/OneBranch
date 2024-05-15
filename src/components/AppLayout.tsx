import { Outlet } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import SideBar from "./SideBar";

const AppLayout = () => {
  return (
    <ProtectedRoute>
      <div className="items-start bg-white start">
        {/* SIDEBAR */}
        <aside className="w-[72px] z-10  min-h-screen relative">
          <SideBar />
        </aside>

        <main className="relative flex-1 min-h-screen bg-c5">
          <div>
            <Outlet />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default AppLayout;
