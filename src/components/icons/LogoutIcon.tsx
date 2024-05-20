import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

const LogoutIcon = ({ className = "", ...props }: ComponentProps<"svg">) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("w-4 h-4 ", className)}
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.75 8a0.5 0.5 0 0 0 -0.5 -0.5H2.935l1.307 -1.12a0.5 0.5 0 0 0 -0.651 -0.76l-2.333 2a0.5 0.5 0 0 0 0 0.76l2.333 2a0.5 0.5 0 0 0 0.651 -0.76l-1.307 -1.12h7.315a0.5 0.5 0 0 0 0.5 -0.5"
    />
    <path d="M6.25 5.333c0 0.468 0 0.702 0.113 0.871a0.667 0.667 0 0 0 0.183 0.183c0.169 0.113 0.403 0.113 0.871 0.113h2.833a1.5 1.5 0 0 1 0 3h-2.833c-0.468 0 -0.702 0 -0.871 0.112a0.667 0.667 0 0 0 -0.183 0.184c-0.113 0.169 -0.113 0.403 -0.113 0.871 0 1.885 0 2.829 0.586 3.414 0.585 0.586 1.528 0.586 3.413 0.586h0.667c1.887 0 2.829 0 3.415 -0.586 0.586 -0.585 0.586 -1.529 0.586 -3.414V5.333c0 -1.885 0 -2.829 -0.586 -3.414S12.802 1.333 10.917 1.333h-0.667c-1.886 0 -2.829 0 -3.414 0.586 -0.586 0.585 -0.586 1.529 -0.586 3.414" />
  </svg>
);
export default LogoutIcon;