import { useAppDispatch } from "@/redux/redux-hooks";
import { useLogoutMutation } from "@/services/auth";
import { baseApi } from "@/services/base";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const dispatch = useAppDispatch();

  const [logoutUser] = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    navigate("/signin");

    logoutUser();

    dispatch(baseApi.util.resetApiState());
  }, [dispatch, logoutUser, navigate]);

  return { handleLogout };
};

export { useLogout };
