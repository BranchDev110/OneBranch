import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";

interface Props {
  avatars: {
    name: string;
    src: string;
  }[];
  limit?: number;
}

const AvatarStack = ({ avatars = [], limit = 0 }: Props) => {
  const rem = avatars.length - limit;

  return (
    <div className="-space-x-3 btwn">
      {avatars.slice(0, limit ? limit : avatars.length).map((a, i) => (
        <Avatar className="border-2 border-white" key={i}>
          <AvatarImage src={a.src} alt={a.name} />
          <AvatarFallback>{a?.name?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
      ))}
      {rem > 0 ? (
        <div className="z-10 w-10 border-2 border-white rounded-full aspect-square center bg-muted">
          +{rem}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default AvatarStack;
