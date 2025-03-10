import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBeat } from "../../store/BeatSlice";
import { getCategories } from "../../store/CategorySlice";
import AuthContext from "../../context/AuthContext"; // import your context

export const AddBeat = () => {
  const dispatch = useDispatch();
  // Get the current user from AuthContext
  const { user } = useContext(AuthContext);
  const { data: categories, status: catStatus } = useSelector(
    (state) => state.category
  );

  // Initialize formData with producer coming from the auth context if available
  const [formData, setFormData] = useState({
    title: "",
    audio_file: null,
    image: null,
    genre: "",
    price: "",
    producer: user?.id || "", // dynamically set from auth context
    category: "",
  });

  // Update producer if user changes
  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({ ...prevData, producer: user.id }));
    }
  }, [user]);

  // Fetch categories on mount
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // Handle input changes, including files and text
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleAddBeat = async () => {
    const form = new FormData();
    form.append("title", formData.title);
    form.append("audio_file", formData.audio_file);
    form.append("image", formData.image);
    form.append("genre", formData.genre);
    form.append("price", formData.price);
    form.append("producer", formData.producer);
    // Append categories as a JSON string containing an array of category IDs.
    form.append("categories", JSON.stringify([formData.category]));

    // Debug: Log FormData entries
    for (let [key, value] of form.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      await dispatch(addBeat(form)).unwrap();
      alert("Beat added successfully!");
      setFormData({
        title: "",
        audio_file: null,
        image: null,
        genre: "",
        price: "",
        producer: user?.id || "",
        category: "",
      });
    } catch (error) {
      console.error("Failed to add beat:", error);
      alert("Failed to add beat: " + error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Beat</h2>

      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 mb-2">
          Title:
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter beat title"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="audio_file" className="block text-gray-700 mb-2">
          Audio File:
        </label>
        <input
          type="file"
          id="audio_file"
          name="audio_file"
          onChange={handleChange}
          className="w-full"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="image" className="block text-gray-700 mb-2">
          Image:
        </label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleChange}
          className="w-full"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="genre" className="block text-gray-700 mb-2">
          Genre:
        </label>
        <input
          type="text"
          id="genre"
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          placeholder="Enter genre"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="price" className="block text-gray-700 mb-2">
          Price:
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Enter price"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      {/* Category dropdown */}
      <div className="mb-4">
        <label htmlFor="category" className="block text-gray-700 mb-2">
          Category:
        </label>
        {catStatus === "loading" ? (
          <p>Loading categories...</p>
        ) : catStatus === "error" ? (
          <p>Error loading categories.</p>
        ) : (
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <button
        onClick={handleAddBeat}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
      >
        Add Beat
      </button>
    </div>
  );
};
