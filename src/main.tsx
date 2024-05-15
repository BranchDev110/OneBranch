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

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
          </Route>

          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/forgot" element={<ForgotPassword />} />
        </Routes>
      </BrowserRouter>

      <Toaster position="top-right" richColors toastOptions={{}} />
    </Provider>
  </React.StrictMode>
);
