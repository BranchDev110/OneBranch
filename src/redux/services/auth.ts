import { createUserWithEmailAndPassword } from "firebase/auth";

import { auth } from "@/firebase/BaseConfig";
import { baseApi } from "./base";

import { AuthBody, SignUpAuthRes } from "@/types/auth.types";

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    signUp: build.mutation<SignUpAuthRes, AuthBody>({
      queryFn: async ({ email, password }) => {
        try {
          const result = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );

          const user = {
            id: result.user.uid,
          };

          return { data: user };
        } catch (e: any) {
          return {
            error: {
              message: e?.message || "Could not sign up user",
            },
          };
        }
      },
    }),
  }),
  overrideExisting: import.meta.env.DEV,
});
export const { useSignUpMutation } = authApi;
export { authApi };
