import useLoggedInUser from "@/hooks/useLoggedInUser";
import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef } from "react";

interface Props extends ComponentPropsWithoutRef<"header"> {}

const AppHeaderNav = ({ className = "", children, ...rest }: Props) => {
  const { user } = useLoggedInUser();

  return (
    <div className={cn("btwn space-x-1", className)} {...rest}>
      <div>{children}</div>
      <div></div>
    </div>
  );
};

export default AppHeaderNav;
