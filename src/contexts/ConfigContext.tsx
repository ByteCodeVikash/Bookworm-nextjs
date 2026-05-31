import React, { createContext, useContext, useState, useEffect } from "react";
import { SiteConfig, defaultSiteConfig, HomepageVersion, SectionConfig, ThemeSet } from "../config/siteConfig";

interface ConfigContextType {
  config: SiteConfig;
  updateConfig: (newConfig: Partial<SiteConfig>) => void;
  updateThemeSet: (themeSet: ThemeSet) => void;
  updateHomepageVersion: (version: HomepageVersion) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  updateSectionOrder: (newOrder: SectionConfig[]) => void;
  resetConfig: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(defaultSiteConfig);

  useEffect(() => {
    const saved = localStorage.getItem("bookworm_layout_config");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.themeSet) {
          if (parsed.headerVersion === "header-v4" || parsed.footerVersion === "footer-v4") {
            parsed.themeSet = "set-4";
            parsed.headerVersion = "header-v4";
            parsed.footerVersion = "footer-v4";
          } else if (parsed.headerVersion === "header-v3" || parsed.footerVersion === "footer-v3") {
            parsed.themeSet = "set-3";
            parsed.headerVersion = "header-v3";
            parsed.footerVersion = "footer-v3";
          } else if (parsed.headerVersion === "header-v2" || parsed.footerVersion === "footer-v2") {
            parsed.themeSet = "set-2";
            parsed.headerVersion = "header-v2";
            parsed.footerVersion = "header-v2";
          } else {
            parsed.themeSet = "set-1";
            parsed.headerVersion = "header-v1";
            parsed.footerVersion = "footer-v1";
          }
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setConfig(parsed);
      } catch (e) {
        console.error("Failed to parse saved layout config", e);
      }
    }
  }, []);

  const saveAndSetConfig = (newConfig: SiteConfig) => {
    setConfig(newConfig);
    localStorage.setItem("bookworm_layout_config", JSON.stringify(newConfig));
  };

  const updateConfig = (newConfig: Partial<SiteConfig>) => {
    saveAndSetConfig({ ...config, ...newConfig });
  };

  const updateThemeSet = (themeSet: ThemeSet) => {
    const mapping = {
      "set-1": { headerVersion: "header-v1" as const, footerVersion: "footer-v1" as const },
      "set-2": { headerVersion: "header-v2" as const, footerVersion: "footer-v2" as const },
      "set-3": { headerVersion: "header-v3" as const, footerVersion: "footer-v3" as const },
      "set-4": { headerVersion: "header-v4" as const, footerVersion: "footer-v4" as const },
    };
    const { headerVersion, footerVersion } = mapping[themeSet];
    updateConfig({ themeSet, headerVersion, footerVersion });
  };

  const updateHomepageVersion = (version: HomepageVersion) => {
    updateConfig({ homepageVersion: version });
  };

  const toggleSectionVisibility = (sectionId: string) => {
    const updatedSections = config.homepageStructure.map((section) =>
      section.id === sectionId ? { ...section, visible: !section.visible } : section
    );
    updateConfig({ homepageStructure: updatedSections });
  };

  const updateSectionOrder = (newOrder: SectionConfig[]) => {
    updateConfig({ homepageStructure: newOrder });
  };

  const resetConfig = () => {
    saveAndSetConfig(defaultSiteConfig);
  };

  return (
    <ConfigContext.Provider
      value={{
        config,
        updateConfig,
        updateThemeSet,
        updateHomepageVersion,
        toggleSectionVisibility,
        updateSectionOrder,
        resetConfig,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useSiteConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useSiteConfig must be used within a ConfigProvider");
  }
  return context;
};
