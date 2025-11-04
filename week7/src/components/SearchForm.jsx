import React, { useState } from 'react';

function SearchForm({ onSearch }) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); 
    onSearch(inputValue.trim()); 
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "30px 0",
        gap: "10px",
      }}
    >
    <form onSubmit={handleSubmit} style={{ margin: "20px" }}>
      <input
        type="text"
        placeholder="Enter student ID"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={{ padding: "8px", width: "200px" }}
      />
      <button type="submit" style={{ marginLeft: "10px", padding: "8px 16px" }}>
        Search
      </button>
    </form>
    </div>
  );
}

export default SearchForm;
