import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSearchResults } from "../../store/SearchSlice";

export const SearchResults = ({ query }) => {
  const dispatch = useDispatch();
  const {
    results = [],
    loading,
    error,
  } = useSelector((state) => state.search || {});

  useEffect(() => {
    if (query) {
      dispatch(fetchSearchResults(query));
    }
  }, [dispatch, query]);

  if (loading) return <p>Loading search results...</p>;
  if (error) return <p>Error: {error}</p>;

  // Filter the results based on the query
  const filteredResults = results.filter((beat) =>
    beat.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <h1>Search Results</h1>
      {filteredResults.length === 0 ? (
        <p>No results found for "{query}"</p>
      ) : (
        <div>
          {filteredResults.map((beat) => (
            <div
              key={beat.id}
              style={{
                border: "1px solid #ddd",
                margin: "10px",
                padding: "10px",
              }}
            >
              <h2>{beat.title}</h2>
              {beat.image && (
                <img
                  src={beat.image}
                  alt={beat.title}
                  style={{ width: "200px", height: "200px" }}
                />
              )}
              <p>{beat.genre}</p>
              <p>Price: ${beat.price}</p>
              <p>Producer: {beat.producer}</p>
              {beat.audio_file && (
                <div>
                  <audio controls>
                    <source src={beat.audio_file} type="audio/mp3" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
