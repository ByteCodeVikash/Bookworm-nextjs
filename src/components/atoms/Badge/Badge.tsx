import React from "react";
import { BadgeProps } from "./types";

export const Badge: React.FC<BadgeProps> = ({ text, className = "" }) => {
  return (
    <div className={`text-uppercase font-size-1 mb-1 text-truncate ${className}`}>
      {text}
    </div>
  );
};
export default Badge;
