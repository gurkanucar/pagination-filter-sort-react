import React from "react";
import { useSearchPage } from "./useSearchPage";

const SearchPage2 = () => {
  const {
    params,
    isLoading,
    isError,
    error,
    setParamField,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    columns,
    data,
  } = useSearchPage({
    searchUrl: "/search2",
  });

  const {
    city,
    restaurantName,
    sortDirection,
    sortField,
    pageSize,
    currentPage,
  } = params;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const totalPages = data ? data.totalPages : 0;

  return (
    <div style={{ margin: 50 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          value={city}
          placeholder="city"
          onChange={(e) => setParamField("city", e.target.value)}
        />
        <input
          type="text"
          placeholder="restaurant name"
          value={restaurantName}
          onChange={(e) => setParamField("restaurantName", e.target.value)}
        />
        <select
          value={sortDirection}
          onChange={(e) => setParamField("sortDirection", e.target.value)}
        >
          <option value="DESC">Descending</option>
          <option value="ASC">Ascending</option>
        </select>
        <select
          value={sortField}
          onChange={(e) => setParamField("sortField", e.target.value)}
        >
          <option value="restaurantName">Restaurant Name</option>
          <option value="reviewsCount">Reviews Count</option>
          <option value="averageReviewStar">Average Review Star</option>
        </select>
        <button onClick={handleSearch}>Search</button>
      </div>

      {data && (
        <div>
          <table>
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th key={index}>{column.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.content.map((item, index) => (
                <tr key={index}>
                  {columns.map((column, columnIndex) => (
                    <td key={columnIndex}>{item[column.dataIndex]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div>
            <div>
              <span>Page Size:</span>
              <select
                value={pageSize}
                onChange={(e) => setParamField("pageSize", e.target.value)}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
              </select>
            </div>
            <div>
              <span>Current Page: {currentPage}</span>
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                First
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                Last
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage2;
