import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

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
    login: build.mutation<any, AuthBody>({
      queryFn: async ({ email, password }) => {
        try {
          const result = await signInWithEmailAndPassword(
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
              message: e?.message || "Could not login user",
            },
          };
        }
      },
    }),
    logout: build.mutation<any, void>({
      queryFn: async () => {
        try {
          await signOut(auth);

          return { data: { message: "success" } };
        } catch (e: any) {
          return {
            error: {
              message: e?.message || "Could not logout user",
            },
          };
        }
      },
    }),
  }),
  overrideExisting: import.meta.env.DEV,
});
export const { useSignUpMutation, useLoginMutation, useLogoutMutation } =
  authApi;
export { authApi };
