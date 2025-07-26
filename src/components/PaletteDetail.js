import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';

const PaletteDetail = () => {
  const { id } = useParams(); // Get route parameter using useParams
  const navigate = useNavigate(); // For navigation
  const [palette, setPalette] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedText, setCopiedText] = useState('');

  useEffect(() => {
    const fetchPalette = async () => {
      try {
        const docRef = doc(db, 'palettes', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPalette({ id: docSnap.id, ...docSnap.data() });
        } else {
          alert('Palette not found');
        }
      } catch (error) {
        alert('Failed to load palette details');
      }
      setLoading(false);
    };

    fetchPalette();
  }, [id]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(text);
      setTimeout(() => setCopiedText(''), 2000); // Clear the popup after 2 seconds
    });
  };

  const hexWithoutHash = (hex) => hex.replace('#', '');

  if (loading) return <div>Loading...</div>;

  if (!palette) return <div>Palette not found</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {palette.title} - {new Date(palette.createdAt.toDate()).toLocaleDateString()}
        </h1>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Back
        </button>
      </div>
      <div className="relative">
        {palette.colors.map((color, idx) => (
          <div
            key={idx}
            className={`w-full ${idx === 0 ? 'rounded-t-lg' : ''} ${idx === palette.colors.length - 1 ? 'rounded-b-lg' : ''}`}
            style={{ backgroundColor: color, height: '150px' }} // Increased height
          >
            <div className="flex flex-col items-center justify-center h-full py-2 space-y-1">
              <span
                className="text-white cursor-pointer px-3 py-1 bg-gray-800 bg-opacity-70 rounded-md hover:bg-gray-600 transition ease-in-out"
                onClick={() => copyToClipboard(hexWithoutHash(color))}
                title="Click to copy HEX"
              >
                {hexWithoutHash(color)}
              </span>
              <span
                className="text-white cursor-pointer px-3 py-1 bg-gray-800 bg-opacity-70 rounded-md hover:bg-gray-600 transition ease-in-out"
                onClick={() => copyToClipboard(hexToRgb(color))}
                title="Click to copy RGB"
              >
                {hexToRgb(color)}
              </span>
            </div>
          </div>
        ))}
        {copiedText && (
          <div className="absolute top-4 right-4 bg-gray-800 text-white p-2 rounded-md">
            Copied: {copiedText}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function
const hexToRgb = (hex) => {
  let r = 0, g = 0, b = 0;
  // 3 digits
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  }
  // 6 digits
  else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  return `rgb(${r}, ${g}, ${b})`;
};

export default PaletteDetail;
