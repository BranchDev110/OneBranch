import "react-truncatable/style.css";
import "react-datepicker/dist/react-datepicker.css";
import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/sonner";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ResetPassword from "./pages/auth/ResetPassword";
import ForgotPassword from "./pages/auth/ForgotPassword";

import Home from "./pages/dashboard/Home";

import AppLayout from "./components/AppLayout";

import { store } from "./redux/store";

import AuthWrapper from "./components/AuthWrapper";
import AllSprints from "./pages/dashboard/sprints/AllSprints";
import AllProjects from "./pages/dashboard/projects/AllProjects";
import SprintDetails from "./pages/dashboard/sprints/SprintDetails";
import FakeSprintDetails from "./pages/dashboard/sprints/FakeSprintDetails";

import ProjectDetails from "./pages/dashboard/projects/ProjectDetails";
import CreateProject from "./pages/dashboard/projects/CreateProject";
import AppErrorBoundary from "./components/AppErrorBoundary";
import AcceptInvitation from "./pages/dashboard/invitation/AcceptInvitation";
import UserDetails from "./pages/dashboard/settings/UserDetails";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <Provider store={store}>
        <AuthWrapper>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Home />} />

                <Route path="/settings" element={<UserDetails />} />

                <Route path="/sprints" element={<AllSprints />} />
                <Route path="/sprints/demo" element={<FakeSprintDetails />} />

                <Route path="/sprints/:id" element={<SprintDetails />} />

                <Route path="/projects" element={<AllProjects />} />
                <Route path="/projects/new" element={<CreateProject />} />

                <Route path="/projects/:id" element={<ProjectDetails />} />

                <Route path="/invitation" element={<AcceptInvitation />} />
              </Route>

              <Route path="/signin" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/reset" element={<ResetPassword />} />
              <Route path="/forgot" element={<ForgotPassword />} />
            </Routes>
          </BrowserRouter>
        </AuthWrapper>

        <Toaster position="top-right" richColors toastOptions={{}} />
      </Provider>
    </AppErrorBoundary>
  </React.StrictMode>
);
