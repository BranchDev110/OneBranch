import React, { useState } from "react";

import { cn } from "@/lib/utils";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  showPassword?: boolean;
  toggleVisibility?: () => void;
}

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, showPassword, toggleVisibility, ...props }, ref) => {
    const [show, setShow] = useState(false);

    const toggle = () => {
      if (toggleVisibility) {
        toggleVisibility();
        return;
      }
      setShow((s) => !s);
    };

    return (
      <div className="pwd-wrapper relative">
        <input
          type={showPassword || show ? "" : "password"}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 pr-10 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          className="center p-1 absolute z-10 right-1 top-1/2 -translate-y-1/2 "
          onClick={toggle}
        >
          {!show ? <EyeOpenIcon /> : <EyeClosedIcon />}
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
