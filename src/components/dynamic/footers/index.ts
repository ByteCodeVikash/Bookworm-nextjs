import React from "react";
import FooterV1 from "./FooterV1";
import FooterV2 from "./FooterV2";
import FooterV3 from "./FooterV3";
import FooterV4 from "./FooterV4";
import { FooterVersion } from "@/config/siteConfig";

export const FooterRegistry: Record<FooterVersion, React.FC> = {
  "footer-v1": FooterV1,
  "footer-v2": FooterV2,
  "footer-v3": FooterV3,
  "footer-v4": FooterV4,
};

export { FooterV1, FooterV2, FooterV3, FooterV4 };

