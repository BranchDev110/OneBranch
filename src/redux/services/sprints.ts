import {
  addDoc,
  collection,
  getDoc,
  serverTimestamp,
  query,
  onSnapshot,
  where,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";

import { baseApi } from "./base";

import { db } from "@/firebase/BaseConfig";
import { Sprint, CreateSprintBody } from "@/types/sprint.types";
import omit from "lodash/omit";
import { COLLECTIONS } from "@/constants/collections";

const sprintsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createSprint: build.mutation<Sprint, CreateSprintBody>({
      queryFn: async (sprint) => {
        try {
          (sprint as any).createdAt = serverTimestamp();
          (sprint as any).isRemoved = false;

          const docRef = await addDoc(
            collection(db, COLLECTIONS.SPRINTS),
            sprint
          );
          const newDoc = await getDoc(docRef);

          if (!newDoc.exists()) {
            throw new Error("Unable to create sprint");
          } else {
            return {
              data: {
                id: newDoc.id,
                ...omit(newDoc.data(), "createdAt"),
              } as Sprint,
            };
          }
        } catch (e: any) {
          return {
            error: {
              message: e?.message || "Could not create sprint",
            },
          };
        }
      },
    }),

    updateSprint: build.mutation<Sprint, Sprint>({
      queryFn: async (sprint) => {
        try {
          const sprintRef = doc(db, COLLECTIONS.SPRINTS, sprint.id);

          await updateDoc(sprintRef, omit(sprint, "id"));

          const updatedSprint = await getDoc(sprintRef);

          return {
            data: {
              id: updatedSprint.id,
              ...omit(updatedSprint.data(), "createdAt"),
            } as Sprint,
          };
        } catch (e: any) {
          return {
            error: {
              message: e?.message || "Could not update sprint",
            },
          };
        }
      },
    }),

    getSprint: build.query<Sprint, string>({
      queryFn: async (sprintId) => {
        try {
          const docRef = doc(db, COLLECTIONS.SPRINTS, sprintId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            return {
              data: {
                id: sprintId,
                ...omit(docSnap.data(), "createdAt"),
              } as Sprint,
            };
          } else {
            throw new Error("Unable to find sprint");
          }
        } catch (e: any) {
          return {
            error: {
              message: e?.message || "Could not find sprint",
            },
          };
        }
      },
    }),

    deleteSprint: build.mutation<boolean, string>({
      queryFn: async (sprintId) => {
        try {
          const sprintRef = doc(db, COLLECTIONS.SPRINTS, sprintId);
          await updateDoc(sprintRef, { isRemoved: true });
          return { data: true };
        } catch (e: any) {
          return {
            error: {
              message: e?.message || "Could not delete sprint",
            },
          };
        }
      },
    }),

    getSprintsInProject: build.query<Sprint[], string>({
      queryFn: async () => ({ data: [] }),
      async onCacheEntryAdded(
        projectId,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        let unsubscribe = () => {};

        try {
          await cacheDataLoaded;
          const doc_refs = query(
            collection(db, COLLECTIONS.SPRINTS),
            where("isRemoved", "==", false),
            where("projectId", "==", projectId),
            orderBy("createdAt", "desc")
          );

          unsubscribe = onSnapshot(doc_refs, (snapshot) => {
            updateCachedData(() => {
              return snapshot?.docs?.map((doc) => ({
                id: doc.id,
                ...omit(doc.data(), "createdAt"),
              })) as Sprint[];
            });
          });
        } catch (error: any) {
          console.log(error);
          throw new Error("Something went wrong getting sprints");
        }

        await cacheEntryRemoved;
        unsubscribe && unsubscribe();
      },
    }),

    getAllUserSprints: build.query<Sprint[], string>({
      queryFn: async () => ({ data: [] }),
      async onCacheEntryAdded(
        userId,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        let unsubscribeProjects = () => {};
        let unsubscribeSprints = () => {};

        try {
          await cacheDataLoaded;
          const projectsQuery = query(
            collection(db, COLLECTIONS.PROJECTS),
            where("isRemoved", "==", false),
            where("members", "array-contains-any", [userId])
          );

          unsubscribeProjects = onSnapshot(
            projectsQuery,
            (projectsSnapshot) => {
              const projectIds: string[] = [];
              projectsSnapshot.forEach((doc) => {
                projectIds.push(doc.id);
              });

              if (projectIds.length === 0) {
                updateCachedData(() => []);
                return;
              }

              const sprintsQuery = query(
                collection(db, COLLECTIONS.SPRINTS),
                where("isRemoved", "==", false),
                where("projectId", "in", projectIds),
                orderBy("createdAt", "desc")
              );

              unsubscribeSprints = onSnapshot(
                sprintsQuery,
                (sprintsSnapshot) => {
                  const sprints: Sprint[] = [];
                  sprintsSnapshot.forEach((doc) => {
                    sprints.push({
                      id: doc.id,
                      ...omit(doc.data(), "createdAt"),
                    } as Sprint);
                  });

                  updateCachedData(() => sprints);
                }
              );
            }
          );
        } catch (error: any) {
          console.log(error);
          throw new Error("Something went wrong getting sprints");
        }

        await cacheEntryRemoved;
        unsubscribeProjects();
        unsubscribeSprints();
      },
    }),
  }),
  overrideExisting: true,
});
export const {
  useCreateSprintMutation,
  useGetSprintsInProjectQuery,
  useGetAllUserSprintsQuery,
  useUpdateSprintMutation,
  useDeleteSprintMutation,
} = sprintsApi;
export { sprintsApi };
