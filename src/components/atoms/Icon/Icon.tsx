import React from "react";
import { IconProps } from "./types";

export const Icon: React.FC<IconProps> = ({ name, className = "" }) => {
  return <i className={`${name} ${className}`} />;
};
export default Icon;
