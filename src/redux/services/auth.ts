import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  verifyPasswordResetCode,
} from "firebase/auth";

import { auth, functions } from "@/firebase/BaseConfig";
import { baseApi } from "./base";

import {
  AuthBody,
  ForgotPasswordBody,
  ResetPasswordBody,
  SignUpAuthRes,
} from "@/types/auth.types";
import { httpsCallable } from "firebase/functions";

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
    sendForgotPassordEmail: build.mutation<any, ForgotPasswordBody>({
      queryFn: async ({ email, originUrl }) => {
        try {
          const sendResetEmail = httpsCallable(
            functions,
            "initiatePasswordReset"
          );
          const res = await sendResetEmail({ email, originUrl });

          return { data: res };
        } catch (e: any) {
          return {
            error: {
              message: e?.message || "Could not initiate password reset",
            },
          };
        }
      },
    }),
    resetUserPassword: build.mutation<any, ResetPasswordBody>({
      queryFn: async ({ password, oobCode }) => {
        try {
          const email = await verifyPasswordResetCode(auth, oobCode);

          const completePasswordReset = httpsCallable(
            functions,
            "completePasswordReset"
          );

          await completePasswordReset({ email, password });

          return { data: true };
        } catch (e: any) {
          return {
            error: {
              message: e?.message || "Could not reset password",
            },
          };
        }
      },
    }),
  }),
  overrideExisting: import.meta.env.DEV,
});
export const {
  useSignUpMutation,
  useLoginMutation,
  useLogoutMutation,
  useSendForgotPassordEmailMutation,
  useResetUserPasswordMutation,
} = authApi;
export { authApi };
