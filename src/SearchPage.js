import React from "react";
import { useSearchPage } from "./useSearchPage";
import { Input, Select, Button, Table } from "antd";

const SearchPage = () => {
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
    searchUrl: "/search",
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

  return (
    <div
      style={{
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", gap: 8 }}>
        <Input
          type="text"
          value={city}
          placeholder="city"
          onChange={(e) => setParamField("city", e.target.value)}
        />
        <Input
          type="text"
          placeholder="restaurant name"
          value={restaurantName}
          onChange={(e) => setParamField("restaurantName", e.target.value)}
        />
        <Select
          value={sortDirection}
          onChange={(value) => setParamField("sortDirection", value)}
        >
          <Select.Option value="DESC">Descending</Select.Option>
          <Select.Option value="ASC">Ascending</Select.Option>
        </Select>
        <Select
          value={sortField}
          onChange={(value) => setParamField("sortField", value)}
        >
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
              y: 650,
            }}
            pagination={{
              current: currentPage,
              pageSize,
              total: data.totalElements,
              onChange: handlePageChange,
              onShowSizeChange: handlePageSizeChange,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20", "30", "50", "100"],
              showTotal: (total, range) =>
                `Showing ${range[0]}-${range[1]} of ${total} items`,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SearchPage;
