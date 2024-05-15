import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

const ChartIcon = ({ className = "", ...props }: ComponentProps<"svg">) => (
  <svg
    viewBox="0 0 16 16.889"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("w-4 h-4 ", className)}
    {...props}
  >
    <path d="M14.222 0.444H1.778c-0.978 0 -1.778 0.8 -1.778 1.778v12.444c0 0.978 0.8 1.778 1.778 1.778h12.444c0.978 0 1.778 -0.8 1.778 -1.778v-12.444c0 -0.978 -0.8 -1.778 -1.778 -1.778m-8.889 12.444H3.556v-6.222h1.778zm3.556 0H7.111v-8.889h1.778zm3.556 0h-1.778v-3.556h1.778z" />
  </svg>
);
export default ChartIcon;
