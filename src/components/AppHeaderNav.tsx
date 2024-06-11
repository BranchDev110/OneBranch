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
    <div
      className={cn(
        "btwn px-4 py-4 flex-wrap space-x-1 bg-white border",
        className
      )}
      {...rest}
    >
      <div className="children">{children}</div>
      <div className="space-x-2 end">
        <Avatar>
          <AvatarImage
            className="object-cover object-center"
            src={user.avatarUrl}
            alt={user.name}
          />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-bold">{user.name}</p>
          <p className="text-xs">{user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default AppHeaderNav;
