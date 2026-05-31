import React from "react";
import { HeaderRegistry, HeaderProps } from "./headers";
import { FooterRegistry } from "./footers";
import { HomepageRegistry } from "./homepages";
import { HeaderVersion, FooterVersion, HomepageVersion } from "@/config/siteConfig";

/**
 * Resolves a header version string to its corresponding component.
 * Supports short form (e.g. "v1", "v2") or long form (e.g. "header-v1", "header-v2").
 */
export function resolveHeader(version: string): React.FC<HeaderProps> {
  const normalized = version.startsWith("header-") ? version : `header-${version}`;
  return HeaderRegistry[normalized as HeaderVersion] || HeaderRegistry["header-v1"];
}

/**
 * Resolves a footer version string to its corresponding component.
 * Supports short form (e.g. "v1", "v2") or long form (e.g. "footer-v1", "footer-v2").
 */
export function resolveFooter(version: string): React.FC {
  const normalized = version.startsWith("footer-") ? version : `footer-${version}`;
  return FooterRegistry[normalized as FooterVersion] || FooterRegistry["footer-v1"];
}

/**
 * Resolves a homepage layout version string to its corresponding component.
 * Supports short form (e.g. "v1", "v2", "home-v1") or long form (e.g. "home-v1", "home-v2").
 */
export function resolveLayout(version: string): React.FC {
  let normalized = version;
  if (!version.startsWith("home-")) {
    if (version.startsWith("v")) {
      normalized = `home-${version}`;
    } else {
      normalized = `home-v${version}`;
    }
  }
  return HomepageRegistry[normalized as HomepageVersion] || HomepageRegistry["home-v1"];
}
