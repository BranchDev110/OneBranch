import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

const UnionIcon = ({ className = "", ...props }: ComponentProps<"svg">) => (
  <svg
    viewBox="0 0 16 9.143"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("w-4 h-4 ", className)}
    {...props}
  >
    <path d="M5.49 1.301a0.762 0.762 0 1 0 -1.077 -1.078L0.603 4.034a0.762 0.762 0 0 0 0 1.077l3.81 3.81a0.762 0.762 0 1 0 1.077 -1.078L2.219 4.571z" />
    <path d="M11.586 0.223a0.762 0.762 0 1 0 -1.078 1.078L13.779 4.571 10.509 7.842a0.762 0.762 0 0 0 1.078 1.078L15.394 5.109a0.762 0.762 0 0 0 0 -1.077z" />
  </svg>
);
export default UnionIcon;
