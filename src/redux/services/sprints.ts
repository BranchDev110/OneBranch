import {
  addDoc,
  collection,
  getDoc,
  serverTimestamp,
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
  }),
  overrideExisting: true,
});
export const { useCreateSprintMutation } = sprintsApi;
export { sprintsApi };
