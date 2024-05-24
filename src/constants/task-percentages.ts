import { TASK_STATUS } from "./task-status";

export const TASK_STATUS_PERCENT: Record<TASK_STATUS, number> = {
  [TASK_STATUS.TODO]: 0,
  [TASK_STATUS.ONGOING]: 0.5,
  [TASK_STATUS.DONE]: 1,
};
