import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase'; // Import the Firebase auth instance
import { collection, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore'; // Import getDoc
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { signOut } from 'firebase/auth'; // Import signOut function

const Home = () => {
  const [palettes, setPalettes] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPalettes = async () => {
      const querySnapshot = await getDocs(collection(db, 'palettes'));
      const sortedPalettes = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => new Date(b.createdAt.toDate()) - new Date(a.createdAt.toDate())); // Sort by most recent
      setPalettes(sortedPalettes);
    };

    fetchPalettes();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (!user) {
      navigate('/sign-in');
      return;
    }
    try {
      const paletteDoc = doc(db, 'palettes', id);
      const paletteSnapshot = await getDoc(paletteDoc); // Use getDoc here
      if (paletteSnapshot.exists() && paletteSnapshot.data().creatorId === user.uid) {
        await deleteDoc(paletteDoc);
        setPalettes(palettes.filter(palette => palette.id !== id)); // Remove from local state
        toast.success('Palette deleted successfully!');
      } else {
        toast.error('You do not have permission to delete this palette.');
      }
    } catch (error) {
      toast.error('Failed to delete palette');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully!'); // Display toast notification
    } catch (error) {
      toast.error('Failed to log out. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4 relative">
      {/* Header with Title and Buttons */}
      <div className="flex flex-col items-center mb-6">
        <Link to="/" className="text-4xl font-extrabold text-center text-gray-800 mb-6">
          PalettePicker
        </Link>
        {/* Buttons positioned at the top-right */}
        <div className="absolute top-4 right-4 flex space-x-4">
          {user ? (
            <>
              <Link to="/create" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                Create Palette
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/sign-in" className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Palettes Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {palettes.map((palette) => (
          <div key={palette.id} className="border border-gray-300 rounded-md p-4 bg-gray-100">
            <div className="flex mb-4">
              {palette.colors.map((color, idx) => (
                <div
                  key={idx}
                  className={`h-16 flex-1 ${idx === 0 ? 'rounded-l-md' : ''} ${idx === palette.colors.length - 1 ? 'rounded-r-md' : ''}`}
                  style={{ backgroundColor: color }}
                ></div>
              ))}
            </div>
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold">{palette.title}</p>
              <p>{new Date(palette.createdAt.toDate()).toLocaleDateString()}</p>
            </div>
            <div className="flex justify-between">
              <Link to={`/palette/${palette.id}`} className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
                View Details
              </Link>
              {user && palette.creatorId === user.uid ? (
                <>
                  <Link
                    to={`/edit/${palette.id}`}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                  >
                    Edit
                  </Link>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                    onClick={() => handleDelete(palette.id)}
                  >
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-md cursor-not-allowed">
                    Edit
                  </span>
                  <span className="bg-red-500 text-white px-3 py-1 rounded-md cursor-not-allowed">
                    Delete
                  </span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
