import { Outlet } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import SideBar from "./SideBar";

const AppLayout = () => {
  return (
    <ProtectedRoute>
      <div className="grid grid-cols-[72px_minmax(0,1fr)] w-full max-w-full">
        {/* SIDEBAR */}
        <aside className="w-[72px] z-10 min-h-screen relative">
          <SideBar />
        </aside>

        <main className="relative min-h-screen bg-c5">
          <div className="">
            <Outlet />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default AppLayout;
