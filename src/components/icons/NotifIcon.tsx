import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

interface Props extends ComponentProps<"svg"> {
  dotClass?: ComponentProps<"circle">["className"];
}

const NotifIcon = ({ className = "", dotClass = "", ...props }: Props) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("w-4 h-4 ", className)}
    {...props}
  >
    <g clipPath="url(#clip0_108_74330)">
      <path d="M14.9998 19C15 19.5046 14.8094 19.9906 14.4664 20.3605C14.1233 20.7305 13.653 20.9572 13.1498 20.995L12.9998 21H10.9998C10.4953 21.0002 10.0093 20.8096 9.6393 20.4665C9.26932 20.1234 9.04269 19.6532 9.00485 19.15L8.99985 19H14.9998ZM11.9998 2C13.8148 1.99997 15.5589 2.70489 16.8641 3.96607C18.1693 5.22726 18.9336 6.94609 18.9958 8.76L18.9998 9V12.764L20.8218 16.408C20.9014 16.567 20.9412 16.7429 20.9378 16.9206C20.9345 17.0984 20.8881 17.2727 20.8027 17.4286C20.7173 17.5845 20.5953 17.7174 20.4473 17.8158C20.2993 17.9143 20.1297 17.9754 19.9528 17.994L19.8378 18H4.16185C3.98401 18.0001 3.80882 17.957 3.65127 17.8745C3.49372 17.792 3.35853 17.6725 3.25727 17.5264C3.156 17.3802 3.0917 17.2116 3.06985 17.0351C3.04801 16.8586 3.06928 16.6795 3.13185 16.513L3.17785 16.408L4.99985 12.764V9C4.99985 7.14348 5.73735 5.36301 7.0501 4.05025C8.36286 2.7375 10.1433 2 11.9998 2Z" />
    </g>
    <circle
      cx={18}
      cy={8}
      r={4}
      className={cn("fill-c4 stroke-white", dotClass)}
    />
    <defs>
      <clipPath id="clip0_108_74330">
        <rect width={24} height={24} />
      </clipPath>
    </defs>
  </svg>
);
export default NotifIcon;