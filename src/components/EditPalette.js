import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import toast, { Toaster } from 'react-hot-toast';
import { ChromePicker } from 'react-color';
import { Filter } from 'bad-words';

const filter = new Filter();

const EditPalette = () => {
  const { id } = useParams();
  const [colors, setColors] = useState(['#FFFFFF', '#000000', '#FF0000', '#00FF00']);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPalette = async () => {
      const paletteRef = doc(db, 'palettes', id);
      const paletteSnap = await getDoc(paletteRef);
      if (paletteSnap.exists()) {
        const paletteData = paletteSnap.data();
        setColors(paletteData.colors);
        setTitle(paletteData.title);
      } else {
        toast.error('Palette not found');
        navigate('/');
      }
    };
    fetchPalette();
  }, [id, navigate]);

  const handleChangeColor = (color, index) => {
    const newColors = [...colors];
    newColors[index] = color.hex;
    setColors(newColors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (filter.isProfane(title)) {
      toast.error('No profanity allowed in title');
      return;
    }
    if (title.length > 60) {
      toast.error('Title cannot exceed 60 characters');
      return;
    }
    try {
      const paletteRef = doc(db, 'palettes', id);
      await updateDoc(paletteRef, {
        colors,
        title,
      });
      toast.success('Palette updated successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to update palette');
    }
  };

  return (
    <div className="relative container mx-auto p-8 bg-gray-100 rounded-lg shadow-lg">
      <Toaster />

      {/* Go Back Button */}
      <button
        className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
        onClick={() => navigate(-1)}
      >
        Go Back
      </button>

      {/* Title */}
      <h1 className="text-4xl font-extrabold text-center mb-12 text-gray-800">Edit Palette</h1>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Title Input and Submit Button in Flex Row */}
        <div className="flex items-center justify-center space-x-4 mb-12">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title"
            maxLength="60" // Maximum of 60 characters
            className="border border-gray-300 p-3 rounded-lg w-2/3 text-lg"
            required
          />
          <button
            type="submit"
            className="w-1/4 bg-green-500 text-white px-5 py-3 rounded-lg shadow hover:bg-green-600 transition"
          >
            Save Changes
          </button>
        </div>

        {/* Color Pickers with Previews */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {colors.map((color, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Preview Box */}
              <div
                className="h-24 w-24 md:h-28 md:w-28 rounded-lg mb-4 shadow-lg"
                style={{ backgroundColor: color }}
              />
              {/* Color Picker */}
              <ChromePicker
                color={color}
                onChangeComplete={(color) => handleChangeColor(color, index)}
                className="rounded-lg shadow-sm"
              />
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};

export default EditPalette;
