import {
  doc,
  setDoc,
  getDoc,
  query,
  collection,
  where,
  onSnapshot,
  documentId,
  updateDoc,
} from "firebase/firestore";

import { baseApi } from "./base";

import {
  CreateNewUserBody,
  AppUserProfile,
  UpdateUserProfileBody,
} from "@/types/user.types";

import { db, functions } from "@/firebase/BaseConfig";
import { ROLES } from "@/constants/roles";
import { COLLECTIONS } from "@/constants/collections";

import omit from "lodash/omit";
import { httpsCallable } from "firebase/functions";

const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createUser: build.mutation<any, CreateNewUserBody>({
      queryFn: async ({ id, name, email }) => {
        try {
          await setDoc(doc(db, COLLECTIONS.USERS, id), {
            name,
            role: ROLES.USER,
            avatarUrl: "",
            email,
          });
          return { data: { name, email, role: ROLES.USER, id, avatarUrl: "" } };
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
          const docSnap = await getDoc(doc(db, COLLECTIONS.USERS, userId));
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
            collection(db, COLLECTIONS.USERS),
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
    //update profile
    editProfile: build.mutation<AppUserProfile, UpdateUserProfileBody>({
      queryFn: async ({ id, email, oldEmail, avatarUrl, name }) => {
        try {
          console.log({ id, email, oldEmail, avatarUrl, name });

          if (oldEmail !== email) {
            const updateUserEmail = httpsCallable(functions, "updateUserEmail");

            await updateUserEmail({ email, oldEmail });
          }

          const userRef = doc(db, COLLECTIONS.USERS, id);

          await updateDoc(userRef, {
            name,
            avatarUrl: avatarUrl || "",
            email,
          });

          const userDoc = await getDoc(userRef);

          if (!userDoc.exists()) {
            throw new Error("User does not exist!");
          }

          return {
            data: omit(userDoc.data(), "createdAt") as AppUserProfile,
          };
        } catch (e: any) {
          return {
            error: {
              message: e?.message || "Could not update user",
            },
          };
        }
      },
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            usersApi.util.updateQueryData("getUserById", id, (draft) => {
              Object.assign(draft, data);
            })
          );
        } catch (e) {
          console.error(e);
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
  useGetUsersInProjectQuery,
  useEditProfileMutation,
} = usersApi;
export { usersApi };
