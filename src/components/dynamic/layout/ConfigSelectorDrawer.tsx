import React, { useState } from "react";
import { useSiteConfig } from "@/contexts/ConfigContext";
import { ThemeSet, HomepageVersion } from "@/config/siteConfig";

export const ConfigSelectorDrawer: React.FC = () => {
  const {
    config,
    updateThemeSet,
    updateHomepageVersion,
    toggleSectionVisibility,
    updateSectionOrder,
    updateConfig,
    resetConfig
  } = useSiteConfig();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"layout" | "business" | "content">("layout");

  const handleBusinessChange = (field: string, value: string) => {
    updateConfig({
      businessDetails: {
        ...config.businessDetails,
        [field]: value
      }
    });
  };

  const handleContentChange = (field: string, value: string) => {
    updateConfig({
      content: {
        ...config.content,
        [field]: value
      }
    });
  };

  const handleSocialsChange = (field: string, value: string) => {
    updateConfig({
      businessDetails: {
        ...config.businessDetails,
        socials: {
          ...config.businessDetails.socials,
          [field]: value
        }
      }
    });
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const newSections = [...config.homepageStructure];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    // Swap sections
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    updateSectionOrder(newSections);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center shadow-lg"
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "56px",
          height: "56px",
          zIndex: 9999,
          cursor: "pointer",
          border: "none",
          backgroundColor: "#1e2022"
        }}
        aria-label="Customize Site Layout"
      >
        <i className="fa fa-cog fa-spin font-size-5 text-white"></i>
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 9998
          }}
        />
      )}

      {/* Slide-out Drawer container */}
      <div
        className="bg-white shadow-lg d-flex flex-column"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "100%",
          maxWidth: "400px",
          height: "100vh",
          zIndex: 9999,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          borderLeft: "1px solid #e0e0e0"
        }}
      >
        {/* Drawer Header */}
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom bg-light">
          <h5 className="mb-0 font-weight-bold font-size-3 text-dark">
            <i className="fa fa-sliders-h mr-2 text-primary"></i> Site Layout Builder
          </h5>
          <button
            onClick={() => setIsOpen(false)}
            className="btn btn-link text-dark p-0 font-size-4"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Tab Selector Links */}
        <div className="d-flex border-bottom">
          <button
            onClick={() => setActiveTab("layout")}
            className={`flex-grow-1 py-2 font-weight-medium border-0 btn ${
              activeTab === "layout" ? "bg-white text-primary border-bottom border-primary" : "bg-light text-gray-500"
            }`}
            style={{ borderRadius: 0, fontSize: "12px" }}
          >
            Layout
          </button>
          <button
            onClick={() => setActiveTab("business")}
            className={`flex-grow-1 py-2 font-weight-medium border-0 btn ${
              activeTab === "business" ? "bg-white text-primary border-bottom border-primary" : "bg-light text-gray-500"
            }`}
            style={{ borderRadius: 0, fontSize: "12px" }}
          >
            Business
          </button>
          <button
            onClick={() => setActiveTab("content")}
            className={`flex-grow-1 py-2 font-weight-medium border-0 btn ${
              activeTab === "content" ? "bg-white text-primary border-bottom border-primary" : "bg-light text-gray-500"
            }`}
            style={{ borderRadius: 0, fontSize: "12px" }}
          >
            Content
          </button>
        </div>

        {/* Drawer Content Panel */}
        <div className="flex-grow-1 overflow-auto p-4">
          {activeTab === "layout" && (
            <div>
              {/* Theme Set Selector option */}
              <div className="form-group mb-4">
                <label className="font-weight-medium text-dark font-size-2 mb-2 d-block">Website Theme Set</label>
                <select
                  value={config.themeSet}
                  onChange={(e) => updateThemeSet(e.target.value as ThemeSet)}
                  className="form-control rounded-0"
                >
                  <option value="set-1">Set 1 (Header V1 + Footer V1)</option>
                  <option value="set-2">Set 2 (Header V2 + Footer V2)</option>
                  <option value="set-3">Set 3 (Header V3 + Footer V3)</option>
                  <option value="set-4">Set 4 (Header V4 + Footer V4)</option>
                </select>
              </div>

              {/* Homepage Layout selector option */}
              <div className="form-group mb-4">
                <label className="font-weight-medium text-dark font-size-2 mb-2 d-block">Homepage Layout</label>
                <select
                  value={config.homepageVersion}
                  onChange={(e) => updateHomepageVersion(e.target.value as HomepageVersion)}
                  className="form-control rounded-0"
                >
                  <option value="home-v1">Home V1 (Abstract Config Layout)</option>
                  <option value="home-v2">Home V2 (Promo Flash Sale Layout)</option>
                  <option value="home-v3">Home V3 (Catalog-First grid layout)</option>
                </select>
              </div>

              {/* Abstract Section Ordering System */}
              {config.homepageVersion === "home-v1" && (
                <div className="border-top pt-4">
                  <h6 className="font-weight-bold text-dark font-size-2 mb-3">
                    Homepage Modules (Abstract Order)
                  </h6>
                  <div className="d-flex flex-column gap-2">
                    {config.homepageStructure.map((section, idx) => (
                      <div
                        key={section.id}
                        className="d-flex align-items-center justify-content-between p-2 border bg-light mb-2"
                        style={{ fontSize: "12px" }}
                      >
                        <div className="d-flex align-items-center">
                          <input
                            type="checkbox"
                            checked={section.visible}
                            onChange={() => toggleSectionVisibility(section.id)}
                            className="mr-2"
                            aria-label={`Toggle ${section.type}`}
                          />
                          <span className={`${section.visible ? "text-dark font-weight-medium" : "text-gray-500 line-through"}`}>
                            {section.type} {section.props?.title ? `(${section.props.title})` : ""}
                          </span>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                          <button
                            onClick={() => moveSection(idx, "up")}
                            disabled={idx === 0}
                            className="btn btn-xs btn-outline-secondary p-1 mr-1"
                            style={{ padding: "1px 5px", fontSize: "10px" }}
                            aria-label="Move Up"
                          >
                            <i className="fa fa-arrow-up"></i>
                          </button>
                          <button
                            onClick={() => moveSection(idx, "down")}
                            disabled={idx === config.homepageStructure.length - 1}
                            className="btn btn-xs btn-outline-secondary p-1"
                            style={{ padding: "1px 5px", fontSize: "10px" }}
                            aria-label="Move Down"
                          >
                            <i className="fa fa-arrow-down"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "business" && (
            <div>
              <h6 className="font-weight-bold text-dark font-size-2 mb-3">Merchant Core Info</h6>

              <div className="form-group mb-3">
                <label className="font-size-2 mb-1">Store Brand Name</label>
                <input
                  type="text"
                  value={config.businessDetails.storeName}
                  onChange={(e) => handleBusinessChange("storeName", e.target.value)}
                  className="form-control rounded-0"
                />
              </div>

              <div className="form-group mb-3">
                <label className="font-size-2 mb-1">Logo URL</label>
                <input
                  type="text"
                  value={config.businessDetails.logoUrl || ""}
                  onChange={(e) => handleBusinessChange("logoUrl", e.target.value)}
                  className="form-control rounded-0"
                  placeholder="/assets/img/logo.png"
                />
              </div>

              <div className="form-group mb-3">
                <label className="font-size-2 mb-1">Support Email</label>
                <input
                  type="email"
                  value={config.businessDetails.email}
                  onChange={(e) => handleBusinessChange("email", e.target.value)}
                  className="form-control rounded-0"
                />
              </div>

              <div className="form-group mb-3">
                <label className="font-size-2 mb-1">Store Phone</label>
                <input
                  type="text"
                  value={config.businessDetails.phone}
                  onChange={(e) => handleBusinessChange("phone", e.target.value)}
                  className="form-control rounded-0"
                />
              </div>

              <div className="form-group mb-3">
                <label className="font-size-2 mb-1">Store Address</label>
                <textarea
                  rows={3}
                  value={config.businessDetails.address}
                  onChange={(e) => handleBusinessChange("address", e.target.value)}
                  className="form-control rounded-0"
                />
              </div>

              <h6 className="font-weight-bold text-dark font-size-2 mt-4 mb-3">Social Media URLs</h6>

              <div className="form-group mb-3">
                <label className="font-size-2 mb-1">Instagram Link</label>
                <input
                  type="text"
                  value={config.businessDetails.socials.instagram || ""}
                  onChange={(e) => handleSocialsChange("instagram", e.target.value)}
                  className="form-control rounded-0"
                  placeholder="#"
                />
              </div>

              <div className="form-group mb-3">
                <label className="font-size-2 mb-1">Facebook Link</label>
                <input
                  type="text"
                  value={config.businessDetails.socials.facebook || ""}
                  onChange={(e) => handleSocialsChange("facebook", e.target.value)}
                  className="form-control rounded-0"
                  placeholder="#"
                />
              </div>

              <div className="form-group mb-3">
                <label className="font-size-2 mb-1">Youtube Link</label>
                <input
                  type="text"
                  value={config.businessDetails.socials.youtube || ""}
                  onChange={(e) => handleSocialsChange("youtube", e.target.value)}
                  className="form-control rounded-0"
                  placeholder="#"
                />
              </div>
            </div>
          )}

          {activeTab === "content" && (
            <div>
              <h6 className="font-weight-bold text-dark font-size-2 mb-3">Landing Page Copy</h6>

              <div className="form-group mb-3">
                <label className="font-size-2 mb-1">Hero Title</label>
                <input
                  type="text"
                  value={config.content?.heroTitle || ""}
                  onChange={(e) => handleContentChange("heroTitle", e.target.value)}
                  className="form-control rounded-0"
                />
              </div>

              <div className="form-group mb-3">
                <label className="font-size-2 mb-1">Hero Subtitle</label>
                <input
                  type="text"
                  value={config.content?.heroSubtitle || ""}
                  onChange={(e) => handleContentChange("heroSubtitle", e.target.value)}
                  className="form-control rounded-0"
                />
              </div>

              <div className="form-group mb-3">
                <label className="font-size-2 mb-1">Button Text</label>
                <input
                  type="text"
                  value={config.content?.buttonText || ""}
                  onChange={(e) => handleContentChange("buttonText", e.target.value)}
                  className="form-control rounded-0"
                />
              </div>

              <div className="form-group mb-3">
                <label className="font-size-2 mb-1">Footer Text</label>
                <input
                  type="text"
                  value={config.content?.footerText || ""}
                  onChange={(e) => handleContentChange("footerText", e.target.value)}
                  className="form-control rounded-0"
                />
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-3 border-top bg-light d-flex gap-2">
          <button
            onClick={resetConfig}
            className="btn btn-outline-danger btn-block rounded-0 font-weight-medium py-2"
          >
            Reset to Default
          </button>
        </div>
      </div>
    </>
  );
};

export default ConfigSelectorDrawer;
