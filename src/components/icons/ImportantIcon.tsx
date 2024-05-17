import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

const ImportantIcon = ({ className = "", ...props }: ComponentProps<"svg">) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("w-4 h-4 ", className)}
    {...props}
  >
    <path d="M5.94033 18.9901H15.0003C15.6503 18.9901 16.2603 18.6801 16.6303 18.1501L20.5803 12.5801C20.7023 12.4113 20.768 12.2083 20.768 12.0001C20.768 11.7918 20.7023 11.5889 20.5803 11.4201L16.6203 5.84007C16.4393 5.57855 16.197 5.36529 15.9146 5.21888C15.6323 5.07247 15.3184 4.99735 15.0003 5.00007H5.94033C5.13033 5.00007 4.66033 5.93007 5.13033 6.59007L9.00033 12.0001L5.13033 17.4101C4.66033 18.0701 5.13033 18.9901 5.94033 18.9901Z" />
  </svg>
);
export default ImportantIcon;
