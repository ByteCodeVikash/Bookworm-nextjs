import React from "react";
import { SearchBarProps } from "./types";
import { Icon } from "@/components/atoms";

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search for books by keyword",
  className = "",
  onSearch
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };
  return (
    <form className={`w-100 ${className}`} onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          type="text"
          className="form-control px-5 height-60 border-right-0 border-dark"
          placeholder={placeholder}
          aria-label="Search"
        />
        <div className="input-group-append">
          <button
            className="btn btn-dark pr-5 py-3"
            type="submit"
          >
            <Icon name="flaticon-search" className="font-size-5" />
          </button>
        </div>
      </div>
    </form>
  );
};
export default SearchBar;
