import {
  serverTimestamp,
  addDoc,
  collection,
  getDoc,
} from "firebase/firestore";
import omit from "lodash/omit";

import { baseApi } from "./base";

import { db } from "@/firebase/BaseConfig";

import { COLLECTIONS } from "@/constants/collections";

import { Task } from "@/types/task.types";
import { TASK_STATUS_PERCENT } from "@/constants/task-percentages";

const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createTask: build.mutation<Task, any>({
      queryFn: async (task) => {
        try {
          (task as any).createdAt = serverTimestamp();
          (task as any).isRemoved = false;

          const taskRef = await addDoc(collection(db, COLLECTIONS.TASKS), task);

          const newTask = await getDoc(taskRef);

          if (!newTask.exists()) {
            throw new Error("Failure to create task");
          } else {
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
    }),
    getTasksInSprint: build.query<Task[], string>({
      queryFn: async () => ({ data: [] }),
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
