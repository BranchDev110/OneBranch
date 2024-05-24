import {
  serverTimestamp,
  addDoc,
  collection,
  getDoc,
  query,
  orderBy,
  where,
  onSnapshot,
  writeBatch,
  doc,
  DocumentReference,
  DocumentSnapshot,
} from "firebase/firestore";
import omit from "lodash/omit";

import { baseApi } from "./base";

import { db } from "@/firebase/BaseConfig";

import { COLLECTIONS } from "@/constants/collections";

import { CreateTaskBodyFull, Task } from "@/types/task.types";
import { TASK_STATUS_PERCENT } from "@/constants/task-percentages";
import { Project } from "@/types/project.types";
import { Sprint } from "@/types/sprint.types";

const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createTask: build.mutation<Task, CreateTaskBodyFull>({
      queryFn: async (task) => {
        try {
          const batch = writeBatch(db);
          (task as any).createdAt = serverTimestamp();
          (task as any).isRemoved = false;

          const projectRef = doc(db, COLLECTIONS.PROJECTS, task.projectId);
          const docRef = await getDoc(projectRef);

          let sprintRef: DocumentReference;
          let sprint: DocumentSnapshot;

          if (task.sprintId) {
            sprintRef = doc(db, COLLECTIONS.SPRINTS, task.sprintId);

            sprint = await getDoc(sprintRef);

            if (!sprint.exists()) {
              throw new Error("Sprint does not exist!");
            }
          }

          if (!docRef.exists()) {
            throw new Error("Project does not exist!");
          }

          const project = await getDoc(projectRef);

          const taskRef = await addDoc(collection(db, COLLECTIONS.TASKS), task);

          //add storyPount yo project
          //add storypont to sprint

          const newTask = await getDoc(taskRef);

          if (!newTask.exists()) {
            throw new Error("Failure to create task");
          } else {
            batch.update(doc(db, COLLECTIONS.PROJECTS, task.projectId), {
              totalPoints:
                (project.data() as Project).totalPoints + task.storyPoint,
            });

            if (task.sprintId) {
              batch.update(doc(db, COLLECTIONS.SPRINTS, task.sprintId), {
                totalPoints:
                  (sprint!.data() as Sprint).totalPoints + task.storyPoint,
              });
            }

            await batch.commit();

            return {
              data: {
                id: newTask.id,
                ...omit(newTask.data(), "createdAt"),
              } as Task,
            };
          }
        } catch (e: any) {
          return {
            error: {
              message: e?.message || "Could not create task",
            },
          };
        }
      },
    }),
    getTasksInProject: build.query<Task[], string>({
      queryFn: async () => ({ data: [] }),
      async onCacheEntryAdded(
        projectId,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        let unsubscribe = () => {};

        try {
          await cacheDataLoaded;

          const tasksRef = query(
            collection(db, COLLECTIONS.TASKS),
            where("isRemoved", "==", false),
            where("projectId", "==", projectId),
            orderBy("createdAt", "desc")
          );

          unsubscribe = onSnapshot(tasksRef, (snapshot) => {
            updateCachedData(() => {
              return snapshot?.docs?.map((doc) => ({
                id: doc.id,
                ...omit(doc.data(), "createdAt"),
              })) as Task[];
            });
          });
        } catch (error) {
          console.log(error);
          throw new Error("Something went wrong getting tasks in project");
        }

        await cacheEntryRemoved;
        unsubscribe && unsubscribe();
      },
    }),
    getTasksInSprint: build.query<Task[], string>({
      queryFn: async () => ({ data: [] }),

      async onCacheEntryAdded(
        sprintId,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        let unsubscribe = () => {};

        try {
          await cacheDataLoaded;

          const tasksRef = query(
            collection(db, COLLECTIONS.TASKS),
            where("isRemoved", "==", false),
            where("sprintId", "==", sprintId),
            orderBy("createdAt", "desc")
          );

          unsubscribe = onSnapshot(tasksRef, (snapshot) => {
            updateCachedData(() => {
              return snapshot?.docs?.map((doc) => ({
                id: doc.id,
                ...omit(doc.data(), "createdAt"),
              })) as Task[];
            });
          });
        } catch (error) {
          console.log(error);
          throw new Error("Something went wrong getting tasks in sprint");
        }

        await cacheEntryRemoved;
        unsubscribe && unsubscribe();
      },
    }),
  }),
  overrideExisting: true,
});
export const {
  useCreateTaskMutation,
  useGetTasksInProjectQuery,
  useGetTasksInSprintQuery,
} = tasksApi;
export { tasksApi };
