import { doc, setDoc, getDoc } from "firebase/firestore";

import { baseApi } from "./base";

import { CreateNewUserBody } from "@/types/user.types";
import { db } from "@/firebase/BaseConfig";
import { UserProfile } from "firebase/auth";

const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createUser: build.mutation<any, CreateNewUserBody>({
      queryFn: async ({ id, name }) => {
        try {
          await setDoc(doc(db, "users", id), { name, role: "USER" });
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
    getUserById: build.query<UserProfile, string>({
      queryFn: async (userId) => {
        try {
          const docSnap = await getDoc(doc(db, "users", userId));
          if (docSnap.exists()) {
            const result = { id: userId, ...docSnap.data() };
            return { data: result };
          } else {
            throw new Error("Unable to find profile info");
          }
        } catch (e) {
          return { error: e };
        }
      },
    }),
  }),
  overrideExisting: import.meta.env.DEV,
});
export const {
  useCreateUserMutation,
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
} = usersApi;
export { usersApi };
