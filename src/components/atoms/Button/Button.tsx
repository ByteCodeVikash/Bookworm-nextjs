import React from "react";
import { ButtonProps } from "./types";

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "dark",
  className = "",
  ...props
}) => {
  const baseClass = variant.startsWith("btn-") ? variant : `btn btn-${variant}`;
  return (
    <button className={`${baseClass} ${className}`} {...props}>
      {children}
    </button>
  );
};
export default Button;
