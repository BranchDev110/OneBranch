import {
  doc,
  setDoc,
  getDoc,
  query,
  collection,
  where,
  onSnapshot,
  documentId,
} from "firebase/firestore";

import { baseApi } from "./base";

import { CreateNewUserBody, AppUserProfile } from "@/types/user.types";

import { db } from "@/firebase/BaseConfig";
import { ROLES } from "@/constants/roles";

const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createUser: build.mutation<any, CreateNewUserBody>({
      queryFn: async ({ id, name, email }) => {
        try {
          await setDoc(doc(db, "users", id), {
            name,
            role: ROLES.USER,
            avatarUrl: "",
          });
          return { data: { name, email } };
        } catch (e: any) {
          return {
            error: {
              message: e?.message || "Could not create user profile",
            },
          };
        }
      },
    }),
    getUserById: build.query<AppUserProfile, string>({
      queryFn: async (userId) => {
        try {
          const docSnap = await getDoc(doc(db, "users", userId));
          if (docSnap.exists()) {
            const result = { id: userId, ...docSnap.data() } as AppUserProfile;
            return { data: result };
          } else {
            throw new Error("Unable to find profile info");
          }
        } catch (e) {
          return { error: e };
        }
      },
    }),
    getUsersInProject: build.query<AppUserProfile[], string[]>({
      queryFn: async () => ({ data: [] }),
      async onCacheEntryAdded(
        members,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        // console.log({ members });

        let unsubscribe = () => {};

        try {
          await cacheDataLoaded;
          const q = query(
            collection(db, "users"),
            where(documentId(), "in", members)
          );

          unsubscribe = onSnapshot(q, (snapshot) => {
            updateCachedData(() => {
              return snapshot?.docs?.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              })) as AppUserProfile[];
            });
          });
        } catch (error: any) {
          console.log(error);
          throw new Error("Something went wrong getting users");
        }

        await cacheEntryRemoved;
        unsubscribe && unsubscribe();
      },
    }),
  }),
  overrideExisting: import.meta.env.DEV,
});
export const {
  useCreateUserMutation,
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
  useGetUsersInProjectQuery,
} = usersApi;
export { usersApi };
