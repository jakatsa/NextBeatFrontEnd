import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // to get the category slug from URL
import axios from "axios";

const CategoryPage = () => {
  const { slug } = useParams(); // Get category slug from URL
  const [categoryBeats, setCategoryBeats] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        // Fetch the category information based on the slug
        const categoryResponse = await axios.get(
          `http://127.0.0.1:8000/beats/api/categories/`
        );
        const currentCategory = categoryResponse.data.find(
          (c) => c.slug === slug
        );
        setCategory(currentCategory);

        if (currentCategory) {
          // Fetch beats belonging to the current category
          const beatsResponse = await axios.get(
            `http://127.0.0.1:8000/beats/api/beat/`
          );
          const filteredBeats = beatsResponse.data.filter((beat) =>
            beat.categories.includes(currentCategory.id)
          );
          setCategoryBeats(filteredBeats);
        }
      } catch (error) {
        console.error("Error fetching category or beats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [slug]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!category) {
    return <p>Category not found!</p>;
  }

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
                src={beat.image || "https://via.placeholder.com/150"} // Placeholder if no image
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
        <p>No beats available in this category.</p>
      )}
    </div>
  );
};

export default CategoryPage;
