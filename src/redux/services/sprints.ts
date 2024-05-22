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

const sprintsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createSprint: build.mutation<Sprint, CreateSprintBody>({
      queryFn: async (sprint) => {
        try {
          (sprint as any).createdAt = serverTimestamp();
          (sprint as any).isRemoved = false;

          const docRef = await addDoc(collection(db, "sprints"), sprint);
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
    //updatesprint

    updateSprint: build.mutation<Sprint, Sprint>({
      queryFn: async (sprint) => {
        try {
          const sprintRef = doc(db, "sprints", sprint.id);

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

    //getsprintbyid

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
            collection(db, "sprints"),
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
            collection(db, "projects"),
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
                collection(db, "sprints"),
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
} = sprintsApi;
export { sprintsApi };
