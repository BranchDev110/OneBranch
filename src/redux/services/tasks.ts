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

import {
  CreateTaskBodyFull,
  EditTaskBody,
  Task,
  UpdateTaskStatusArgs,
} from "@/types/task.types";
import { TASK_STATUS_PERCENT } from "@/constants/task-percentages";
import { Project } from "@/types/project.types";
import { Sprint } from "@/types/sprint.types";
import { TASK_STATUS } from "@/constants/task-status";

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
    updateTask: build.mutation<Task, EditTaskBody>({
      queryFn: async (task) => {
        try {
          const taskRef = doc(db, COLLECTIONS.TASKS, task.id);
          const t = await getDoc(taskRef);

          if (!t.exists()) {
            throw new Error("Task does not exist");
          }

          const batch = writeBatch(db);

          const projectRef = doc(db, COLLECTIONS.PROJECTS, task.projectId);
          const docRef = await getDoc(projectRef);

          if (!docRef.exists()) {
            throw new Error("Project does not exist!");
          }

          const project = docRef.data();
          const deltaTotal = task.storyPoint - task.oldPoints;
          let deltaCurrent = 0;

          if (deltaTotal) {
            deltaCurrent = TASK_STATUS_PERCENT[task.status] * deltaTotal;

            batch.update(projectRef, {
              currentPoints: project.currentPoints + deltaCurrent,
              totalPoints: project.totalPoints + deltaTotal,
            });
          }

          if (task.sprintId && deltaTotal) {
            const sprintRef = doc(db, COLLECTIONS.SPRINTS, task.sprintId);
            const sprintDocRef = await getDoc(sprintRef);

            if (!sprintDocRef.exists()) {
              throw new Error("Sprint does not exist!");
            }

            const sprint = sprintDocRef.data();

            batch.update(sprintRef, {
              currentPoints: sprint.currentPoints + deltaCurrent,
              totalPoints: sprint.totalPoints + deltaTotal,
            });
          }

          batch.update(taskRef, omit(task, "id"));

          await batch.commit();

          const taskDoc = await getDoc(taskRef);

          return {
            data: {
              id: taskDoc.id,
              ...omit(taskDoc.data(), "createdAt"),
            } as Task,
          };
        } catch (e: any) {
          return {
            error: {
              message: e?.message || "Could not edit task",
            },
          };
        }
      },
    }),
    updateTaskStatus: build.mutation<Task, UpdateTaskStatusArgs>({
      queryFn: async ({ taskId, status }) => {
        try {
          const taskRef = doc(db, COLLECTIONS.TASKS, taskId);
          const t = await getDoc(taskRef);

          if (!t.exists()) {
            throw new Error("Task does not exist");
          }
          const task = t.data() as Task;
          const newCurrentPoints =
            TASK_STATUS_PERCENT[status] * task.storyPoint;
          const oldCurrentPoints =
            TASK_STATUS_PERCENT[task.status as TASK_STATUS] * task.storyPoint;

          const delta = newCurrentPoints - oldCurrentPoints;

          const batch = writeBatch(db);

          const projectRef = doc(db, COLLECTIONS.PROJECTS, task.projectId);
          const docRef = await getDoc(projectRef);

          if (!docRef.exists()) {
            throw new Error("Project does not exist!");
          }

          const project = docRef.data();

          batch.update(projectRef, {
            currentPoints: project.currentPoints + delta,
          });

          if (task.sprintId) {
            const sprintRef = doc(db, COLLECTIONS.SPRINTS, task.sprintId);
            const sprintDocRef = await getDoc(sprintRef);

            if (!sprintDocRef.exists()) {
              throw new Error("Sprint does not exist!");
            }

            const sprint = sprintDocRef.data();

            batch.update(sprintRef, {
              currentPoints: sprint.currentPoints + delta,
            });
          }

          batch.update(taskRef, {
            status,
          });
          await batch.commit();

          return {
            data: {
              ...omit(task, "createdAt"),
              id: taskId,
              status,
            } as Task,
          };
        } catch (e: any) {
          return {
            error: {
              message: e?.message || "Could not update task status",
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
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
} = tasksApi;
export { tasksApi };
