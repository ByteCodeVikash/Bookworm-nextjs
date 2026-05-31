import React from "react";
import { DynamicLayoutShell } from "@/components/dynamic/layout/DynamicLayoutShell";
import { AbstractLayoutRenderer } from "@/components/dynamic/layout/AbstractLayoutRenderer";
import { useSiteConfig } from "@/contexts/ConfigContext";
import { resolveLayout } from "@/components/dynamic/resolvers";

export default function IndexPage() {
  const { config } = useSiteConfig();

  const renderHomeContent = () => {
    if (config.homepageVersion === "home-v1") {
      return <AbstractLayoutRenderer sections={config.homepageStructure} />;
    }
    
    const VersionComponent = resolveLayout(config.homepageVersion);
    return <VersionComponent />;
  };

  return (
    <DynamicLayoutShell>
      {renderHomeContent()}
    </DynamicLayoutShell>
  );
}

