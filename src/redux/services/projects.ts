import {
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
  writeBatch,
  updateDoc,
} from "firebase/firestore";

import { baseApi } from "./base";
import { db, functions } from "@/firebase/BaseConfig";

import {
  AddUserToProjectAndTaskArgs,
  CreateProjectBody,
  EditProjectBody,
  Project,
  ProjectColumn,
  SendInviteArgs,
  SetActiveSprintForProjectArgs,
} from "@/types/project.types";
import { Task } from "@/types/task.types";

import omit from "lodash/omit";

import { COLLECTIONS } from "@/constants/collections";
import { httpsCallable } from "firebase/functions";

const projectsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createProject: build.mutation<Project, CreateProjectBody>({
      queryFn: async (project) => {
        try {
          const projectBody = omit(project, ["columns"]);
          (projectBody as any).createdAt = serverTimestamp();
          (projectBody as any).isRemoved = false;
          (projectBody as any).activeSprintId = "";

          //Create project
          const projectRef = await addDoc(
            collection(db, COLLECTIONS.PROJECTS),
            projectBody
          );

          const projectId = projectRef.id;

          const res = await runTransaction(db, async (transaction) => {
            const docRef = await transaction.get(projectRef);

            if (!docRef.exists()) {
              throw new Error("Project does not exist!");
            }

            //create columns
            const columnIds = await Promise.all(
              project.columns.map(async (column) => {
                const newColRef = await addDoc(
                  collection(db, COLLECTIONS.COLUMNS),
                  {
                    name: column.name,
                    projectId,
                  }
                );
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

    deleteProject: build.mutation<boolean, string>({
      queryFn: async (projecttId) => {
        try {
          const projRef = doc(db, COLLECTIONS.PROJECTS, projecttId);
          await updateDoc(projRef, { isRemoved: true });
          return { data: true };
        } catch (e: any) {
          return {
            error: {
              message: e?.message || "Could not delete project",
            },
          };
        }
      },
    }),

    editProject: build.mutation<any, EditProjectBody>({
      queryFn: async (project) => {
        try {
          const batch = writeBatch(db);
          const projectRef = doc(db, COLLECTIONS.PROJECTS, project.id);
          const docRef = await getDoc(projectRef);

          if (!docRef.exists()) {
            throw new Error("Project does not exist!");
          }

          let columns = docRef.data().columns as string[];

          if (project.newColumns.length) {
            const columnIds = await Promise.all(
              project.newColumns.map(async (column) => {
                const newColRef = await addDoc(
                  collection(db, COLLECTIONS.COLUMNS),
                  {
                    name: column.name,
                    projectId: project.id,
                  }
                );
                return newColRef.id;
              })
            );

            columns = [...columns, ...columnIds];

            batch.update(projectRef, {
              columns,
            });
          }

          if (project.oldColumns.length) {
            await Promise.all(
              project.oldColumns.map(async (column) => {
                batch.update(doc(db, COLLECTIONS.COLUMNS, column.id), {
                  name: column.name,
                  projectId: project.id,
                });

                return column.id;
              })
            );
          }

          batch.update(projectRef, {
            name: project.name,
            description: project.description,
            startDate: project.startDate,
            endDate: project.endDate,
            admin: project.admin,
            members: project.members,
            currentPoints: project.currentPoints,
            totalPoints: project.totalPoints,
            columns,
            imageUrl: project.imageUrl,
            createdAt: docRef.data().createdAt,
          });

          await batch.commit();

          return {
            data: {
              id: project.id,
              name: project.name,
              description: project.description,
              startDate: project.startDate,
              endDate: project.endDate,
              admin: project.admin,
              members: project.members,
              currentPoints: project.currentPoints,
              totalPoints: project.totalPoints,
              columns,
              imageUrl: project.imageUrl,
            },
          };
        } catch (e: any) {
          return {
            error: {
              message: e?.message || "Could not edit project",
            },
          };
        }
      },
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedProject } = await queryFulfilled;
          dispatch(
            projectsApi.util.updateQueryData("getProject", id, (draft) => {
              Object.assign(draft, updatedProject);
            })
          );
        } catch (e) {
          console.error(e);
        }
      },
    }),

    setActiveSprintForProject: build.mutation<
      Project,
      SetActiveSprintForProjectArgs
    >({
      queryFn: async ({ projectId, sprintId }) => {
        try {
          const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId);
          const docRef = await getDoc(projectRef);

          if (!docRef.exists()) {
            throw new Error("Project does not exist!");
          }

          const sprintRef = doc(db, COLLECTIONS.SPRINTS, sprintId);
          const sprintSnap = await getDoc(sprintRef);

          if (!sprintSnap.exists()) {
            throw new Error("Sprint does not exist!");
          }

          await updateDoc(projectRef, {
            activeSprintId: sprintId,
          });

          return {
            data: {
              ...omit(docRef.data(), "createdAt"),
              activeSprintId: sprintId,
            } as Project,
          };
        } catch (e: any) {
          return {
            error: {
              message: e?.message || "Could not set active sprint for project",
            },
          };
        }
      },
      async onQueryStarted({ projectId }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedProject } = await queryFulfilled;
          dispatch(
            projectsApi.util.updateQueryData(
              "getProject",
              projectId,
              (draft) => {
                Object.assign(draft, updatedProject);
              }
            )
          );
        } catch (e) {
          console.error(e);
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
            collection(db, COLLECTIONS.PROJECTS),
            where("isRemoved", "==", false),
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
            collection(db, COLLECTIONS.COLUMNS),
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
          throw new Error("Unable to find project columns");
        }

        await cacheEntryRemoved;
        unsubscribe && unsubscribe();
      },
    }),

    getProject: build.query<Project, string>({
      queryFn: async (projectId) => {
        try {
          const docRef = doc(db, COLLECTIONS.PROJECTS, projectId);
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

      async onCacheEntryAdded(
        projectId,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        let unsubscribe = () => {};

        try {
          await cacheDataLoaded;
          unsubscribe = onSnapshot(
            doc(db, COLLECTIONS.PROJECTS, projectId),
            (doc) => {
              updateCachedData(
                () =>
                  ({
                    id: doc.id,
                    ...omit(doc.data(), "createdAt"),
                  } as Project)
              );
            }
          );
        } catch (error) {
          console.log(error);
          throw new Error("Something went wrong getting the project");
        }

        await cacheEntryRemoved;
        unsubscribe && unsubscribe();
      },
    }),

    addUserToProjectAndTask: build.mutation<any, AddUserToProjectAndTaskArgs>({
      queryFn: async ({ projectId, userId, taskId, email, verifyToken }) => {
        try {
          const batch = writeBatch(db);

          const inviteRef = doc(db, COLLECTIONS.INVITATIONS, verifyToken);
          const inviteDocSnap = await getDoc(inviteRef);

          if (!inviteDocSnap.exists()) {
            throw new Error("Unable to find inviation");
          }

          const invite = inviteDocSnap.data();

          if (!invite?.invitees?.includes(email)) {
            throw new Error(`Unable to verify invitation for ${email}`);
          }

          const docRef = doc(db, COLLECTIONS.PROJECTS, projectId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const project = docSnap.data() as Project;
            const users = [...project.members];

            if (users.includes(userId) || project.admin === userId) {
              throw new Error("User is already part of the project");
            }

            users.push(userId);
            batch.update(docRef, { members: users });

            if (taskId) {
              const taskDocRef = doc(db, COLLECTIONS.TASKS, taskId);
              const taskDocSnap = await getDoc(taskDocRef);

              if (taskDocSnap.exists()) {
                const task = taskDocSnap.data() as Task;

                if (
                  task.assignees.includes(userId) ||
                  task.createdBy === userId
                ) {
                  throw new Error("User is already part of the task");
                }

                batch.update(docRef, {
                  assignees: [...task.assignees, userId],
                });
              } else {
                throw new Error("Unable to find task");
              }
            }

            await batch.commit();

            return {
              data: {
                ...omit(project, "createdAt"),
                members: users,
                id: docSnap.id,
              } as Project,
            };
          } else {
            throw new Error("Unable to find project");
          }
        } catch (e: any) {
          // console.log(e);
          return {
            error: {
              message: e?.message || "Could not add user to project",
            },
          };
        }
      },
    }),

    sendInvitationToUsers: build.mutation<any, SendInviteArgs>({
      queryFn: async (args) => {
        try {
          const invitationRef = await addDoc(
            collection(db, COLLECTIONS.INVITATIONS),
            {
              invitees: args.emails,
              invitedBy: args.invitedBy,
              createdAt: serverTimestamp(),
            }
          );

          (args as any).inviteId = invitationRef.id;

          const sendInvite = httpsCallable(functions, "sendProjectInvite");

          const res = await sendInvite(args);

          return { data: res };
        } catch (e: any) {
          return {
            error: {
              message: e?.message || "Could not send invites",
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
  useDeleteProjectMutation,
  useAddUserToProjectAndTaskMutation,
  useSendInvitationToUsersMutation,
  useSetActiveSprintForProjectMutation,
} = projectsApi;
export { projectsApi };
