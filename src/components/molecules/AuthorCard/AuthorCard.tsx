import React from "react";
import { AuthorCardProps } from "./types";

export const AuthorCard: React.FC<AuthorCardProps> = ({ author }) => {
  return (
    <div className="text-reset d-block">
      <img
        src={author.imageUrl}
        className="mx-auto mb-5 d-block rounded-circle"
        alt={author.name}
        width="142"
        height="142"
      />
      <div className="author__body text-center">
        <h2 className="author__name h6 mb-0">{author.name}</h2>
        <div className="text-gray-700 font-size-2">{author.booksCount} Published Books</div>
      </div>
    </div>
  );
};
export default AuthorCard;
