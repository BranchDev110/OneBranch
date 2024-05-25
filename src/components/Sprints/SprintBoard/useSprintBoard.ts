import { useContext } from "react";

import { SprintBoardContext } from "./index";

export const useSprintBoard = () => {
  const context = useContext(SprintBoardContext);

  if (context === undefined) {
    throw new Error("useSprintBoard must be used within a SprintBoardProvider");
  }
  return context;
};
