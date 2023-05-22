import React from "react";
import { useSearchPage } from "./useSearchPage";
import { Input, Select, Button, Table } from "antd";

const SearchPage = () => {
  const {
    city,
    setCity,
    restaurantName,
    setRestaurantName,
    sortDirection,
    setSortDirection,
    sortField,
    setSortField,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    isLoading,
    isError,
    error,
    data,
    handleSearch,
    handlePageChange,
    handlePageSizeChange,
    columns,
  } = useSearchPage({ searchUrl: "/search" });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div style={{ margin: 50 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <Input
          type="text"
          value={city}
          placeholder="city"
          onChange={(e) => setCity(e.target.value)}
        />
        <Input
          type="text"
          placeholder="restaurant name"
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
        />
        <Select value={sortDirection} onChange={setSortDirection}>
          <Select.Option value="DESC">Descending</Select.Option>
          <Select.Option value="ASC">Ascending</Select.Option>
        </Select>
        <Select value={sortField} onChange={setSortField}>
          <Select.Option value="restaurantName">Restaurant Name</Select.Option>
          <Select.Option value="reviewsCount">Reviews Count</Select.Option>
          <Select.Option value="averageReviewStar">
            Average Review Star
          </Select.Option>
        </Select>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {data && (
        <div>
          <Table
            dataSource={data.content}
            columns={columns}
            scroll={{
              y: 630,
            }}
            pagination={{
              current: currentPage,
              pageSize,
              total: data.totalElements,
              onChange: handlePageChange,
              onShowSizeChange: handlePageSizeChange,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "30"],
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SearchPage;
