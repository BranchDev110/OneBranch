import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import useLoggedInUser from "@/hooks/useLoggedInUser";

interface Props extends ComponentPropsWithoutRef<"header"> {}

const AppHeaderNav = ({ className = "", children, ...rest }: Props) => {
  const { user } = useLoggedInUser();

  if (!user?.id) {
    return <></>;
  }

  return (
    <div className={cn("btwn space-x-1 bg-c5 border", className)} {...rest}>
      <div>{children}</div>
      <div className="space-x-1 end">
        <Avatar>
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default AppHeaderNav;
