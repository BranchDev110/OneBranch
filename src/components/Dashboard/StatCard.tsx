import { round } from "@/lib/round";
import { cn } from "@/lib/utils";
import { ArrowTopRightIcon, ArrowBottomRightIcon } from "@radix-ui/react-icons";
import { ComponentProps, ReactNode } from "react";

interface CommonProps {
  icon: ReactNode;
  iconClass?: ComponentProps<"div">["className"];
  label: string;
  phrase: string;
  rate: number;
}

interface RatioProps {
  isRatio: boolean;
  pre: number;
  post: number;
  val?: never;
}

interface SingleProps {
  val: number;
  pre?: never;
  post?: never;
  isRatio?: never;
}

type Props = CommonProps & (SingleProps | RatioProps);

const StatCard = ({ icon, iconClass, label, phrase, rate, ...rest }: Props) => {
  return (
    <article className="bg-white p-[6%] rounded-[5%] min-h-[100px]">
      <div
        className={cn(
          "center rounded-full aspect-square w-11.5 text-white overflow-hidden",
          iconClass
        )}
      >
        {icon}
      </div>

      <p className="mt-5 mb-2.5 text-sm font-medium text-c5-500">{label}</p>

      {rest.isRatio ? (
        <>
          <h3 className="text-lg font-bold">
            <span className="text-3xl">{rest.pre}/</span>
            {rest.post}
          </h3>
        </>
      ) : (
        <h3 className="text-3xl font-bold">{rest.val}</h3>
      )}

      <div className="grid mt-2.5 grid-cols-[14px_minmax(0,1fr)] gap-1 text-xs">
        <i
          className={cn({
            "text-c4": rate < 0,
            "text-c2": rate >= 0,
          })}
        >
          {rate < 0 ? <ArrowBottomRightIcon /> : <ArrowTopRightIcon />}
        </i>
        <p>
          {round(Math.abs(rate))}% {phrase}
        </p>
      </div>
    </article>
  );
};

export default StatCard;
