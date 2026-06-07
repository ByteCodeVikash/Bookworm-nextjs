"use client";

import { useEffect, useState } from "react";
import { NewReleasesProps } from "./types";
import { ProductCard } from "@/components/molecules";
import { fetchApi } from "@/utils/api";
import { Book } from "@/types";

export const NewReleases: React.FC<NewReleasesProps> = ({
  history,
  science,
  romance,
  travel
}) => {
  const [activeTab, setActiveTab] = useState<"history" | "science" | "romance" | "travel">("history");
  const [localHistory, setLocalHistory] = useState<Book[]>(history || []);
  const [localScience, setLocalScience] = useState<Book[]>(science || []);
  const [localRomance, setLocalRomance] = useState<Book[]>(romance || []);
  const [localTravel, setLocalTravel] = useState<Book[]>(travel || []);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      try {
        const [histData, sciData, romData, travData] = await Promise.all([
          fetchApi<Book[]>("/api/books.php?group=new_release&new_release_tab=history"),
          fetchApi<Book[]>("/api/books.php?group=new_release&new_release_tab=science"),
          fetchApi<Book[]>("/api/books.php?group=new_release&new_release_tab=romance"),
          fetchApi<Book[]>("/api/books.php?group=new_release&new_release_tab=travel"),
        ]);
        if (active) {
          setLocalHistory(histData);
          setLocalScience(sciData);
          setLocalRomance(romData);
          setLocalTravel(travData);
        }
      } catch (err) {
        console.error("Failed to load new releases:", err);
      }
    };
    loadData();
    return () => { active = false; };
  }, []);

  const booksToRender =
    activeTab === "history"
      ? localHistory
      : activeTab === "science"
      ? localScience
      : activeTab === "romance"
      ? localRomance
      : localTravel;

  return (
    <section className="space-bottom-3 banner-with-product">
      <div className="container">
        <header className="mb-5 d-md-flex justify-content-between align-items-center">
          <h2 className="font-size-7 mb-3 mb-md-0">New Releases</h2>
          <ul className="nav nav-gray-700 flex-nowrap flex-md-wrap overflow-auto overflow-md-visible" role="tablist">
            <li className="nav-item mx-4 flex-shrink-0 flex-md-shrink-1" style={{ listStyleType: "none" }}>
              <button
                onClick={() => setActiveTab("history")}
                className={`nav-link pb-1 px-0 btn btn-link font-weight-medium ${activeTab === "history" ? "active border-bottom border-primary border-width-2" : ""}`}
                style={{ background: "none", boxShadow: "none", color: "inherit", textDecoration: "none" }}
              >
                History
              </button>
            </li>
            <li className="nav-item mx-4 flex-shrink-0 flex-md-shrink-1" style={{ listStyleType: "none" }}>
              <button
                onClick={() => setActiveTab("science")}
                className={`nav-link pb-1 px-0 btn btn-link font-weight-medium ${activeTab === "science" ? "active border-bottom border-primary border-width-2" : ""}`}
                style={{ background: "none", boxShadow: "none", color: "inherit", textDecoration: "none" }}
              >
                Science &amp; Math
              </button>
            </li>
            <li className="nav-item mx-4 flex-shrink-0 flex-md-shrink-1" style={{ listStyleType: "none" }}>
              <button
                onClick={() => setActiveTab("romance")}
                className={`nav-link pb-1 px-0 btn btn-link font-weight-medium ${activeTab === "romance" ? "active border-bottom border-primary border-width-2" : ""}`}
                style={{ background: "none", boxShadow: "none", color: "inherit", textDecoration: "none" }}
              >
                Romance
              </button>
            </li>
            <li className="nav-item ml-4 flex-shrink-0 flex-md-shrink-1" style={{ listStyleType: "none" }}>
              <button
                onClick={() => setActiveTab("travel")}
                className={`nav-link pb-1 px-0 btn btn-link font-weight-medium ${activeTab === "travel" ? "active border-bottom border-primary border-width-2" : ""}`}
                style={{ background: "none", boxShadow: "none", color: "inherit", textDecoration: "none" }}
              >
                Travel
              </button>
            </li>
          </ul>
        </header>

        <div className="tab-content u-slick__tab">
          <div className="tab-pane fade show active" role="tabpanel">
            <div className="row no-gutters">
              {/* Promo Banner Left */}
              <div className="col-xl-4 border-right-0 border px-1" style={{ backgroundColor: "#fff5f4" }}>
                <div className="banner px-lg-8 px-3 py-4 py-xl-0 d-flex h-100 align-items-center justify-content-center">
                  <div className="banner__body text-center">
                    <div className="banner__image pb-1 mb-5">
                      <img
                        className="img-fluid"
                        src="https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-2.png"
                        alt="Promo sale banner"
                        width="350"
                        height="282"
                      />
                    </div>
                    <h3 className="banner_text m-0">
                      <span className="d-block mb-1 font-size-10 font-weight-regular">Get Extra</span>
                      <span className="d-block mb-3 font-size-12 text-primary font-weight-medium">Sale -25%</span>
                      <span className="d-block mb-3 text-uppercase font-size-7 font-weight-regular text-gray-400">
                        On Order Over $100
                      </span>
                    </h3>
                  </div>
                </div>
              </div>

              {/* Tab Grid Right */}
              <div className="col-xl-8">
                <ul className="products list-unstyled row no-gutters row-cols-2 row-cols-md-3 row-cols-xl-4 border-top border-left my-0">
                  {booksToRender.map((book) => (
                    <li key={book.id} className="product col border-bottom border-right" style={{ listStyleType: "none" }}>
                      <ProductCard book={book} layout="grid" showBorder={false} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default NewReleases;
