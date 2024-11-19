import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../store/CategorySlice";
import { getBeats } from "../../store/BeatSlice";

export const CategoryBeats = () => {
  const dispatch = useDispatch();
  const { data: categories, status: categoryStatus } = useSelector(
    (state) => state.category
  );
  const { data: beats, status: beatStatus } = useSelector(
    (state) => state.beat
  );

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getBeats());
  }, [dispatch]);

  // Handle loading and error states
  if (categoryStatus === "loading" || beatStatus === "loading") {
    return <p>Loading...</p>;
  }

  if (categoryStatus === "error" || beatStatus === "error") {
    return <p>Error loading data</p>;
  }


  
  return (
    <div className="container mx-auto">
      <h1 className="text-center text-2xl font-bold mb-6">Beats by Category</h1>

      {categories.map((category) => {
        // Filter beats for this category
        const categoryBeats = beats.filter((beat) =>
          beat.categories.includes(category.id)
        );

        return (
          <div key={category.id} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{category.name}</h2>
            {categoryBeats.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryBeats.map((beat) => (
                  <div
                    key={beat.id}
                    className="bg-white shadow-md rounded-lg overflow-hidden p-4"
                  >
                    <img
                      src={beat.image}
                      alt={beat.title}
                      className="w-full h-48 object-cover mb-4"
                    />
                    <h3 className="text-lg font-semibold">{beat.title}</h3>
                    <p className="text-gray-500">Genre: {beat.genre}</p>
                    <p className="text-gray-500">Price: Ksh. {beat.price}</p>
                    <audio controls className="w-full mt-4">
                      <source src={beat.audio_file} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                ))}
              </div>
            ) : (
              <p>No beats available for {category.name}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};
