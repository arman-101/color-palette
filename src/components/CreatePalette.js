import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import toast, { Toaster } from 'react-hot-toast';
import { Filter } from 'bad-words';
import { ChromePicker } from 'react-color';

const filter = new Filter();

const CreatePalette = () => {
  const [colors, setColors] = useState(['#FFFFFF', '#000000', '#FF0000', '#00FF00']);
  const [title, setTitle] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleChangeColor = (color, index) => {
    const newColors = [...colors];
    newColors[index] = color.hex;
    setColors(newColors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be signed in to create a palette.');
      navigate('/sign-in');
      return;
    }
    if (filter.isProfane(title)) {
      toast.error('No profanity allowed in title');
      return;
    }
    if (title.length > 60) {
      toast.error('Title cannot exceed 60 characters');
      return;
    }
    try {
      await addDoc(collection(db, 'palettes'), {
        colors,
        title,
        createdAt: Timestamp.now(),
        creatorId: user.uid // Save the creator's ID
      });
      toast.success('Palette created successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to create palette');
    }
  };

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="relative container mx-auto p-8 bg-gray-100 rounded-lg shadow-lg">
      <Toaster />

      {/* Go Back Button */}
      <button
        className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
        onClick={handleGoBack}
      >
        Go Back
      </button>

      {/* Title */}
      <h1 className="text-4xl font-extrabold text-center mb-12 text-gray-800">Create a Palette</h1>

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
            className="w-1/4 bg-blue-500 text-white px-5 py-3 rounded-lg shadow hover:bg-blue-600 transition"
          >
            Create
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

export default CreatePalette;
