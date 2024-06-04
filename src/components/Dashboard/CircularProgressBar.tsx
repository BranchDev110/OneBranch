import { round } from "@/lib/round";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

interface Props {
  guageClass?: ComponentProps<"circle">["className"];
  labelClass?: ComponentProps<"text">["className"];
  total: number;
  value: number;
}

const CircularProgressBar = ({
  guageClass,
  total,
  value,
  labelClass,
}: Props) => {
  const circumference = 219.9;
  const val = round((value / total) * 100);
  const offset = ((total - value) / total) * circumference;

  return (
    <svg className="w-full h-full" viewBox="0 0 100 100">
      <circle
        cx="50"
        cy="50"
        r="35"
        fill="transparent"
        stroke="#e5e7eb"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle
        cx="50"
        cy="50"
        r="35"
        fill="transparent"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="219.9"
        strokeDashoffset={offset}
        transform="rotate(-90 50 50)"
        className={cn(guageClass)}
      />
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={"1.35rem"}
        className={cn("font-bold", labelClass)}
      >
        {val}%
      </text>
    </svg>
  );
};

export default CircularProgressBar;
