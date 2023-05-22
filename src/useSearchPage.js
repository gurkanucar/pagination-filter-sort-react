import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";

const useSearchRestaurants = (searchParams) => {
  return useQuery(["restaurants", searchParams.toString()], async () => {
    const response = await fetch(
      `http://localhost:8082/api/restaurant?${searchParams.toString()}`
    );
    if (!response.ok) {
      throw new Error("An error occurred while fetching the data");
    }
    return response.json();
  });
};

export const useSearchPage = ({ searchUrl }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [city, setCity] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [sortDirection, setSortDirection] = useState("DESC");
  const [sortField, setSortField] = useState("averageReviewStar");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    searchParams.set("city", city);
    searchParams.set("restaurantName", restaurantName);
    searchParams.set("sortDirection", sortDirection);
    searchParams.set("sortField", sortField);

    navigate(`${searchUrl}?${searchParams.toString()}`);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setCity(searchParams.get("city") || "");
    setRestaurantName(searchParams.get("restaurantName") || "");
    setSortDirection(searchParams.get("sortDirection") || "DESC");
    setSortField(searchParams.get("sortField") || "averageReviewStar");
    setCurrentPage(Number(searchParams.get("page")) + 1 || 1);
  }, [location.search]);

  const searchParams = new URLSearchParams(location.search);
  searchParams.set("size", pageSize.toString());
  const { data, isLoading, isError, error } =
    useSearchRestaurants(searchParams);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    navigateWithPage(page - 1);
  };

  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
    setCurrentPage(1);
    navigateWithPageSize(0, size);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Restaurant Name",
      dataIndex: "restaurantName",
      key: "restaurantName",
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "District",
      dataIndex: "district",
      key: "district",
    },
    {
      title: "Address",
      dataIndex: "detailedAddress",
      key: "address",
    },
    {
      title: "Star Count",
      dataIndex: "starCount",
      key: "starCount",
      render: (starCount) => starCount.toFixed(2),
    },
    {
      title: "Review Count",
      dataIndex: "reviewsCount",
      key: "reviewsCount",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Opening Time",
      dataIndex: "openingTime",
      key: "openingTime",
    },
  ];

  const navigateWithPage = (page) => {
    const params = new URLSearchParams(location.search);
    params.set("page", page.toString());
    params.set("size", pageSize.toString());
    navigate(`${searchUrl}?${params.toString()}`);
  };

  const navigateWithPageSize = (page, size) => {
    const params = new URLSearchParams(location.search);
    params.set("page", page.toString());
    params.set("size", size.toString());
    navigate(`${searchUrl}?${params.toString()}`);
  };

  return {
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
  };
};
