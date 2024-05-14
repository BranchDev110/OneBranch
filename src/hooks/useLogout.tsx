import { useAppDispatch } from "@/redux/redux-hooks";
import { useLogoutMutation } from "@/services/auth";
import { baseApi } from "@/services/base";
import { useCallback } from "react";

const useLogout = () => {
  const dispatch = useAppDispatch();
  const [logoutUser] = useLogoutMutation();

  const handleLogout = useCallback(async () => {
    logoutUser();

    dispatch(baseApi.util.resetApiState());
  }, [dispatch, logoutUser]);

  return { handleLogout };
};

export default useLogout;
