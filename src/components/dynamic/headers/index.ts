import React from "react";
import HeaderV1 from "./HeaderV1";
import HeaderV2 from "./HeaderV2";
import HeaderV3 from "./HeaderV3";
import HeaderV4 from "./HeaderV4";
import { HeaderVersion } from "@/config/siteConfig";

interface HeaderProps {
  onToggleCart: () => void;
  onToggleAccount: () => void;
  onToggleCategories: () => void;
}

export const HeaderRegistry: Record<HeaderVersion, React.FC<HeaderProps>> = {
  "header-v1": HeaderV1,
  "header-v2": HeaderV2,
  "header-v3": HeaderV3,
  "header-v4": HeaderV4,
};

export { HeaderV1, HeaderV2, HeaderV3, HeaderV4 };
export type { HeaderProps };

