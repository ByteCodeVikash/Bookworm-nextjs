import React from "react";
import { NewsletterFormProps } from "./types";

export const NewsletterForm: React.FC<NewsletterFormProps> = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };
  return (
    <form onSubmit={handleSubmit} className="form-row justify-content-center">
      <div className="col-md-5 mb-3 mb-md-2">
        <input
          type="email"
          className="form-control px-5 height-60 border-dark"
          placeholder="Enter email for weekly newsletter."
          required
        />
      </div>
      <div className="col-sm-2 ml-md-2">
        <button type="submit" className="btn btn-dark rounded-0 btn-wide py-3 font-weight-medium">
          Subscribe
        </button>
      </div>
    </form>
  );
};
export default NewsletterForm;
