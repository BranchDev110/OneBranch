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

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUserTasksProgress: build.query<any, RangeProps>({
      queryFn: async (args) => {
        //get tasks created in range
        //count tasts that are complete
        //return {complete,total}
        //then calculate for the other period before too to get percentage count
        console.log(args);
        return { data: {} };
      },
    }),
    getUrgentTasks: build.query<any, any>({
      queryFn: async () => {
        return { data: {} };
      },
    }),
    getActiveProjects: build.query<any, any>({
      queryFn: async () => {
        //get projects created in range
        //get projects that completed points are not expectd points

        return { data: {} };
      },
    }),
    getMembers: build.query<any, any>({
      queryFn: async () => {
        //get all projects
        //get user list in all projects
        //filter user out
        return { data: {} };
      },
    }),
  }),
  overrideExisting: true,
});
export const { useGetUserTasksProgressQuery } = dashboardApi;
export { dashboardApi };
