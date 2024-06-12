import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

const UserIcon = ({ className = "", ...props }: ComponentProps<"svg">) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-5 h-5 ", className)}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.75a4.25 4.25 0 1 0 0 8.5 4.25 4.25 0 0 0 0 -8.5M6.251 7a5.749 5.749 0 1 1 11.499 0 5.749 5.749 0 0 1 -11.5 0m-3.59 15c0 -4.421 4.337 -7.751 9.34 -7.751s9.34 3.329 9.34 7.751a0.749 0.749 0 1 1 -1.5 0c0 -3.32 -3.363 -6.251 -7.84 -6.251s-7.84 2.931 -7.84 6.251a0.751 0.751 0 0 1 -1.5 0"
      />
    </svg>
  );
};

export default UserIcon;
