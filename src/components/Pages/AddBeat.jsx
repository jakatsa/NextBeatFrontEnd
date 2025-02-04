import { useState } from 'react';
import { addBeat } from "../../store/BeatSlice";
import { useDispatch } from 'react-redux';


export const AddBeat = () => {
  const [formData, setFormData] = useState({
    title: '',
    audio_file: null,
    image: null,
    genre: '',
    price: ''
  });
  const dispatch = useDispatch();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleAddBeat = () => {
    const form = new FormData();
    form.append('title', formData.title);
    form.append('audio_file', formData.audio_file);
    form.append('image', formData.image);
    form.append('genre', formData.genre);
    form.append('price', formData.price);

    dispatch(addBeat(form));
    setFormData({
      title: '',
      audio_file: null,
      image: null,
      genre: '',
      price: ''
    });
  };

  return (
    <div>
      <label>
        Title:
        <input 
          type="text" 
          name="title" 
          value={formData.title} 
          onChange={handleChange} 
        />
      </label>

      <label>
        Audio File:
        <input 
          type="file" 
          name="audio_file" 
          onChange={handleChange} 
        />
      </label>

      <label>
        Image:
        <input 
          type="file" 
          name="image" 
          onChange={handleChange} 
        />
      </label>

      <label>
        Genre:
        <input 
          type="text" 
          name="genre" 
          value={formData.genre} 
          onChange={handleChange} 
        />
      </label>

      <label>
        Price:
        <input 
          type="number" 
          name="price" 
          value={formData.price} 
          onChange={handleChange} 
        />
      </label>

      <button onClick={handleAddBeat}>Add Beat</button>
    </div>
  );
};
