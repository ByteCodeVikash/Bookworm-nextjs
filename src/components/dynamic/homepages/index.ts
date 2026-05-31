import React from "react";
import HomeLayoutV1 from "./HomeLayoutV1";
import HomeLayoutV2 from "./HomeLayoutV2";
import HomeLayoutV3 from "./HomeLayoutV3";
import { HomepageVersion } from "@/config/siteConfig";

export const HomepageRegistry: Record<HomepageVersion, React.FC> = {
  "home-v1": HomeLayoutV1,
  "home-v2": HomeLayoutV2,
  "home-v3": HomeLayoutV3,
};

export { HomeLayoutV1, HomeLayoutV2, HomeLayoutV3 };
export type { HomepageVersion };

