import React from "react";
import SVGGuage from "./SVGCompass";

interface Props {
  label: string;
  amount: number;
  total: number;
  completed: number;
  delayed: number;
  ongoing: number;
}

const CompassGuage = ({ label, amount }: Props) => {
  return (
    <div className="p-4 rounded-lg min-h-32 bg-c5-600/[34%]">
      <h3 className="py-4">{label}</h3>
      <div className="relative isolate">
        <SVGGuage />
        <div className="absolute bottom-[5%] z-10 text-center -translate-x-1/2 left-1/2">
          <h4 className="text-xl md:text-3xl">{amount}%</h4>
          <p className="font-semibold text-c5-500">Completed</p>
        </div>
      </div>
    </div>
  );
};

export default CompassGuage;
