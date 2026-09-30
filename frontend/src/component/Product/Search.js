import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Search.css";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    navigate(keyword.trim() ? `/products/${keyword}` : "/products");
  };

  return (
    <form className="search-box" onSubmit={searchSubmitHandler}>
      <input
        type="text"
        placeholder="Search a product..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default Search;
