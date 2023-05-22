import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";

function SearchPagePure() {
  const location = useLocation();
  const navigate = useNavigate();

  const [city, setCity] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [sortDirection, setSortDirection] = useState("DESC");
  const [sortField, setSortField] = useState("averageReviewStar");
  const [pageSize, setPageSize] = useState(10);

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    searchParams.set("city", city);
    searchParams.set("restaurantName", restaurantName);
    searchParams.set("sortDirection", sortDirection);
    searchParams.set("sortField", sortField);

    navigate(`/searchPure?${searchParams.toString()}`);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setCity(searchParams.get("city") || "");
    setRestaurantName(searchParams.get("restaurantName") || "");
    setSortDirection(searchParams.get("sortDirection") || "DESC");
    setSortField(searchParams.get("sortField") || "averageReviewStar");
  }, [location.search]);

  const searchParams = new URLSearchParams(location.search);
  searchParams.set("size", pageSize.toString());
  const { data, isLoading, isError, error } =
    useSearchRestaurants(searchParams);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <input
        type="text"
        value={restaurantName}
        onChange={(e) => setRestaurantName(e.target.value)}
      />
      <select
        value={sortDirection}
        onChange={(e) => setSortDirection(e.target.value)}
      >
        <option value="DESC">Descending</option>
        <option value="ASC">Ascending</option>
      </select>
      <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
        <option value="restaurantName">Restaurant Name</option>
        <option value="reviewsCount">Reviews Count</option>
        <option value="averageReviewStar">Average Review Star</option>
      </select>
      <button onClick={handleSearch}>Search</button>

      {data && (
        <div>
          {data.content.map((x) => (
            <h2 key={x.id}>{x.restaurantName}</h2>
          ))}
        </div>
      )}

      <div>
        <label>Page Size: </label>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
      </div>

      {data && (
        <div>
          <button onClick={() => navigateWithPage(0)} disabled={data.first}>
            First
          </button>
          <button
            onClick={() => navigateWithPage(data.page - 1)}
            disabled={data.first}
          >
            Previous
          </button>
          <button
            onClick={() => navigateWithPage(data.page + 1)}
            disabled={data.last}
          >
            Next
          </button>
          <button
            onClick={() => navigateWithPage(data.totalPages - 1)}
            disabled={data.last}
          >
            Last
          </button>
        </div>
      )}
    </div>
  );

  function navigateWithPage(page) {
    const params = new URLSearchParams(location.search);
    params.set("page", page.toString());
    params.set("size", pageSize.toString());
    navigate(`/searchPure?${params.toString()}`);
  }
}

function useSearchRestaurants(searchParams) {
  return useQuery(
    ["restaurants", searchParams.toString()],
    async () => {
      const response = await fetch(
        `http://localhost:8082/api/restaurant?${searchParams.toString()}`
      );
      if (!response.ok) {
        throw new Error("An error occurred while fetching the data");
      }
      return response.json();
    },
    {
      keepPreviousData: true,
      staleTime: 5000,
      getNextPageParam: (lastPage) => lastPage.page - 1,
    }
  );
}

export default SearchPagePure;
