import {
  //getDocs,
  doc,
  getDoc,
  collection,
  addDoc,
  runTransaction,
  serverTimestamp,
  onSnapshot,
  where,
  query,
  orderBy,
} from "firebase/firestore";

import { baseApi } from "./base";

import { db } from "@/firebase/BaseConfig";

import {
  CreateProjectBody,
  Project,
  ProjectColumn,
} from "@/types/project.types";
import omit from "lodash/omit";

const projectsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createProject: build.mutation<Project, CreateProjectBody>({
      queryFn: async (project) => {
        try {
          const projectBody = omit(project, ["columns"]);
          (projectBody as any).createdAt = serverTimestamp();

          //Create project
          const projectRef = await addDoc(
            collection(db, "projects"),
            projectBody
          );

          const projectId = projectRef.id;

          const res = await runTransaction(db, async (transaction) => {
            const docRef = await transaction.get(projectRef);

            if (!docRef.exists()) {
              throw "Project does not exist!";
            }

            //create columns
            const columnIds = await Promise.all(
              project.columns.map(async (column) => {
                const newColRef = await addDoc(collection(db, "columns"), {
                  name: column.name,
                  projectId,
                });
                return newColRef.id;
              })
            );

            //add columns to project
            transaction.update(projectRef, { columns: columnIds });

            //return new project if needed
            return {
              id: projectId,
              columns: columnIds,
              ...omit(docRef.data(), "createdAt"),
            } as Project;
          });

          return { data: res };
        } catch (e: any) {
          return {
            error: {
              message: e?.message || "Could not create project",
            },
          };
        }
      },
    }),
    editProject: build.mutation<any, CreateProjectBody>({
      queryFn: async (project) => {
        try {
          return { data: {} };
        } catch (e: any) {
          return {
            error: {
              message: e?.message || "Could not edit project",
            },
          };
        }
      },
    }),
    getUsersProjects: build.query<Project[], string>({
      queryFn: async () => ({ data: [] }),
      async onCacheEntryAdded(
        userId,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        let unsubscribe = () => {};

        try {
          await cacheDataLoaded;
          const doc_refs = query(
            collection(db, "projects"),
            where("members", "array-contains-any", [userId]),
            orderBy("createdAt", "desc")
          );

          unsubscribe = onSnapshot(doc_refs, (snapshot) => {
            updateCachedData(() => {
              return snapshot?.docs?.map((doc) => ({
                id: doc.id,
                ...omit(doc.data(), "createdAt"),
              })) as Project[];
            });
          });
        } catch (error: any) {
          console.log(error);
          throw new Error("Something went wrong getting projects");
        }

        await cacheEntryRemoved;
        unsubscribe && unsubscribe();
      },
    }),
    getProjectColumns: build.query<ProjectColumn[], string>({
      queryFn: async () => ({ data: [] }),
      async onCacheEntryAdded(
        projectId,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        let unsubscribe = () => {};
        await cacheDataLoaded;

        try {
          const q = query(
            collection(db, "columns"),
            where("projectId", "==", projectId)
          );
          unsubscribe = onSnapshot(q, (snapshot) => {
            updateCachedData(() => {
              return snapshot?.docs?.map((doc) => ({
                id: doc.id,
                name: doc.data().name,
              })) as ProjectColumn[];
            });
          });
        } catch (error) {
          console.log(error);
          throw new Error("Unable to find project");
        }

        await cacheEntryRemoved;
        unsubscribe && unsubscribe();
      },
    }),
    getProject: build.query<Project, string>({
      queryFn: async (projectId) => {
        try {
          const docRef = doc(db, "projects", projectId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            return {
              data: {
                id: projectId,
                ...omit(docSnap.data(), "createdAt"),
              } as Project,
            };
          } else {
            throw new Error("Unable to find project");
          }
        } catch (e: any) {
          return {
            error: {
              message: e?.message || "Could not find project",
            },
          };
        }
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateProjectMutation,
  useGetUsersProjectsQuery,
  useGetProjectQuery,
  useGetProjectColumnsQuery,
  useEditProjectMutation,
} = projectsApi;
export { projectsApi };
