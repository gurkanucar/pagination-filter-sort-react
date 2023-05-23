import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";

const useSearchRestaurants = (searchParams) => {
  return useQuery(["restaurants", searchParams.toString()], async () => {
    const response = await axios.get(`http://localhost:8082/api/restaurant`, {
      params: searchParams,
    });
    if (response.status !== 200) {
      throw new Error("An error occurred while fetching the data");
    }
    return response.data;
  });
};

export const useSearchPage = ({ searchUrl }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [params, setParams] = useState({
    city: "",
    restaurantName: "",
    sortDirection: "DESC",
    sortField: "averageReviewStar",
    pageSize: 10,
    currentPage: 0,
  });

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    const { city, restaurantName, sortDirection, sortField } = params;
    searchParams.set("city", city);
    searchParams.set("restaurantName", restaurantName);
    searchParams.set("sortDirection", sortDirection);
    searchParams.set("sortField", sortField);

    navigate(`${searchUrl}?${searchParams.toString()}`);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setParams((prevState) => ({
      ...prevState,
      city: searchParams.get("city") || "",
      restaurantName: searchParams.get("restaurantName") || "",
      sortDirection: searchParams.get("sortDirection") || "DESC",
      sortField: searchParams.get("sortField") || "averageReviewStar",
      currentPage: Number(searchParams.get("page")) + 1 || 1,
    }));
  }, [location.search]);

  const searchParams = new URLSearchParams(location.search);
  searchParams.set("size", params.pageSize.toString());
  const { data, isLoading, isError, error } =
    useSearchRestaurants(searchParams);

  const handlePageChange = (page) => {
    setParams((prevState) => ({
      ...prevState,
      currentPage: page,
    }));
    navigateWithPage(page - 1);
  };

  const handlePageSizeChange = (current, size) => {
    setParams((prevState) => ({
      ...prevState,
      pageSize: size,
      currentPage: 1,
    }));
    navigateWithPageSize(0, size);
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Restaurant Name",
      dataIndex: "restaurantName",
      key: "restaurantName",
    },
    { title: "City", dataIndex: "city", key: "city" },
    { title: "District", dataIndex: "district", key: "district" },
    { title: "Address", dataIndex: "detailedAddress", key: "address" },
    {
      title: "Star Count",
      dataIndex: "starCount",
      key: "starCount",
      render: (starCount) => starCount.toFixed(2),
    },
    { title: "Review Count", dataIndex: "reviewsCount", key: "reviewsCount" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Opening Time", dataIndex: "openingTime", key: "openingTime" },
  ];

  const navigateWithPage = (page) => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("page", page.toString());
    urlParams.set("size", params.pageSize.toString());
    navigate(`${searchUrl}?${urlParams.toString()}`);
  };

  const navigateWithPageSize = (page, size) => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("page", page.toString());
    urlParams.set("size", size.toString());
    navigate(`${searchUrl}?${urlParams.toString()}`);
  };

  const setParamField = (fieldName, value) => {
    setParams((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  return {
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
  };
};
