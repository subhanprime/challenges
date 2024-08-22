import React from 'react';

const Filter = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <select name="date" onChange={handleChange}>
        <option value="">All Dates</option>
        <option value="2023-08-01">August 2023</option>
        {/* Add more date options */}
      </select>

      <select name="categories" onChange={handleChange}>
        <option value="">All Categories</option>
        <option value="technology">Technology</option>
        {/* Add more categories */}
      </select>

      <select name="sources" onChange={handleChange}>
        <option value="">All Sources</option>
        <option value="bbc-news">BBC News</option>
        {/* Add more sources */}
      </select>
    </div>
  );
};

export default Filter;
