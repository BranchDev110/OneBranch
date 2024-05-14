import { doc, setDoc } from "firebase/firestore";

import { baseApi } from "./base";

import { CreateNewUserBody } from "@/types/user.types";
import { db } from "@/firebase/BaseConfig";

const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createUser: build.mutation<any, CreateNewUserBody>({
      queryFn: async ({ id, name }) => {
        try {
          await setDoc(doc(db, "users", id), { name });
          return { data: { name, role: "USER" } };
        } catch (e: any) {
          return {
            error: {
              message: e?.message || "Could not create user profile",
            },
          };
        }
      },
    }),
  }),
  overrideExisting: import.meta.env.DEV,
});
export const { useCreateUserMutation } = usersApi;
export { usersApi };
