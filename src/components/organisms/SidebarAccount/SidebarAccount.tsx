"use client";

import React, { useState } from "react";
import { SidebarAccountProps } from "./types";
import { Icon } from "@/components/atoms";

export const SidebarAccount: React.FC<SidebarAccountProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <aside
      className={`u-sidebar u-sidebar__lg transition-all ${isOpen ? "active" : ""}`}
      style={{
        display: "block",
        transform: isOpen ? "translate3d(0, 0, 0)" : "translate3d(100%, 0, 0)",
        visibility: isOpen ? "visible" : "hidden",
        transition: "transform 0.3s ease, visibility 0.3s ease",
        zIndex: 9999
      }}
    >
      <div className="u-sidebar__scroller">
        <div className="u-sidebar__container">
          <div className="u-header-sidebar__footer-offset">
            {/* Close Button */}
            <div className="d-flex align-items-center position-absolute top-0 right-0 z-index-2 mt-5 mr-md-6 mr-4">
              <button
                onClick={onClose}
                type="button"
                className="close ml-auto"
                aria-label="Close Sidebar"
              >
                <span>Close <Icon name="fas fa-times ml-2" /></span>
              </button>
            </div>

            {/* Content */}
            <div className="u-sidebar__body">
              <div className="u-sidebar__content u-header-sidebar__content">
                <header className="border-bottom px-4 px-md-6 py-4">
                  <h2 className="font-size-3 mb-0 d-flex align-items-center">
                    <Icon name="flaticon-user mr-3 font-size-5" />Account
                  </h2>
                </header>

                <div className="p-4 p-md-6">
                  {mode === "signin" ? (
                    <form onSubmit={handleSubmit}>
                      <div className="form-group mb-4">
                        <label className="form-label">Username or email *</label>
                        <input
                          type="email"
                          className="form-control rounded-0 height-4 px-4"
                          placeholder="yourname@domain.com"
                          required
                        />
                      </div>

                      <div className="form-group mb-4">
                        <label className="form-label">Password *</label>
                        <input
                          type="password"
                          className="form-control rounded-0 height-4 px-4"
                          required
                        />
                      </div>

                      <div className="d-flex justify-content-between mb-5 align-items-center">
                        <div className="custom-control custom-checkbox d-flex align-items-center text-muted">
                          <input type="checkbox" className="custom-control-input" id="rememberMeCheck" />
                          <label className="custom-control-label" htmlFor="rememberMeCheck">
                            <span className="font-size-2 text-secondary-gray-700">Remember me</span>
                          </label>
                        </div>
                        <a href="#" className="font-size-2 text-muted">Lost password?</a>
                      </div>

                      <button type="submit" className="btn btn-block btn-dark rounded-0 py-3 font-weight-medium mb-3">
                        Sign In
                      </button>

                      <div className="text-center font-size-2 text-muted">
                        Don&apos;t have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setMode("signup")}
                          className="btn btn-link p-0 text-primary font-weight-medium font-size-2"
                        >
                          Register Now
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div className="form-group mb-4">
                        <label className="form-label">Email address *</label>
                        <input
                          type="email"
                          className="form-control rounded-0 height-4 px-4"
                          required
                        />
                      </div>

                      <div className="form-group mb-4">
                        <label className="form-label">Password *</label>
                        <input
                          type="password"
                          className="form-control rounded-0 height-4 px-4"
                          required
                        />
                      </div>

                      <div className="form-group mb-5">
                        <label className="form-label">Confirm Password *</label>
                        <input
                          type="password"
                          className="form-control rounded-0 height-4 px-4"
                          required
                        />
                      </div>

                      <button type="submit" className="btn btn-block btn-dark rounded-0 py-3 font-weight-medium mb-3">
                        Register
                      </button>

                      <div className="text-center font-size-2 text-muted">
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setMode("signin")}
                          className="btn btn-link p-0 text-primary font-weight-medium font-size-2"
                        >
                          Sign In
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
export default SidebarAccount;
