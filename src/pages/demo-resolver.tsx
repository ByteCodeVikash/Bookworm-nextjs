import React from "react";
import PreviewRenderer from "@/components/dynamic/layout/PreviewRenderer";

export default function DemoResolverPage() {
  // Example config matching client request:
  const demoConfig = {
    header: "v2",
    footer: "v1",
    layout: "home-v3"
  };

  return (
    <div>
      <div style={{ background: "#212529", color: "#fff", padding: "12px", textAlign: "center", fontSize: "14px", fontFamily: "sans-serif" }}>
        <strong>Configuration Driven Layout Resolver Demo</strong> — Rendering configuration: <code>{JSON.stringify(demoConfig)}</code>
      </div>
      <PreviewRenderer config={demoConfig} />
    </div>
  );
}
