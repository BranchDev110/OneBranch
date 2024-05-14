import React from "react";
import logo from "../../assets/water.png";

const FormHeader = () => {
  return (
    <div className="flex items-center mb-6 text-2xl font-semibold ">
      <img className="w-8 h-8 mr-2" src={logo} alt="logo" />
      OneBranch
    </div>
  );
};

export default FormHeader;
