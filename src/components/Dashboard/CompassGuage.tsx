import {} from "react";
import SVGGuage from "./SVGCompass";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  amount: number;
  total: number;
  completed: number;
  delayed: number;
  ongoing: number;
}

const CompassGuage = ({
  label,
  amount,
  total,
  completed,
  delayed,
  ongoing,
}: Props) => {
  return (
    <div className="p-4 px-6 rounded-lg min-h-32 bg-c5-600/[34%]">
      <h3 className="py-4">{label}</h3>
      <div className="relative isolate">
        <SVGGuage />
        <div className="absolute bottom-[5%] z-10 text-center -translate-x-1/2 left-1/2">
          <h4 className="text-base md:text-3xl">{amount}%</h4>
          <p className="text-xs font-semibold text-c5-500 md:text-base">
            Completed
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 px-[2%] md:grid-cols-4 mt-7">
        <div className="">
          <h3
            className={cn(
              `text-lg  font-bold md:text-xl xl:text-2xl 2xl:text-3xl`,
              {}
            )}
          >
            {total}
          </h3>
          <p className="mt-2 font-semibold text-c5-500">Total projects</p>
        </div>

        <div>
          <h3
            className={cn(
              `text-lg  font-bold md:text-xl xl:text-2xl 2xl:text-3xl text-c2`,
              {}
            )}
          >
            {completed}
          </h3>
          <p className="mt-2 font-semibold text-c5-500">Completed</p>
        </div>

        <div>
          <h3
            className={cn(
              `text-lg  font-bold md:text-xl xl:text-2xl 2xl:text-3xl text-c3`,
              {}
            )}
          >
            {delayed}
          </h3>
          <p className="mt-2 font-semibold text-c5-500">Delayed</p>
        </div>

        <div>
          <h3
            className={cn(
              `text-lg font-bold  md:text-xl xl:text-2xl 2xl:text-3xl text-c4`,
              {}
            )}
          >
            {ongoing}
          </h3>
          <p className="mt-2 font-semibold text-c5-500">Ongoing</p>
        </div>
      </div>
    </div>
  );
};

export default CompassGuage;
