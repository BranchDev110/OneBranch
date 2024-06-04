import { useGetUserByIdQuery } from "@/services/users";
import { auth } from "@/firebase/BaseConfig";

const useLoggedInUser = () => {
  const {
    currentData: user,
    isLoading,
    isFetching,
    isError,
    error,
    isSuccess,
    refetch,
  } = useGetUserByIdQuery(auth?.currentUser?.uid as unknown as string, {
    skip: !auth?.currentUser?.uid,
  });
  return {
    user,
    isLoading: isLoading || isFetching,
    isError,
    error,
    isSuccess,
    refetch,
  };
};

export default useLoggedInUser;
