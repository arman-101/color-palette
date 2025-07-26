import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import PaletteDetail from './components/PaletteDetail';
import CreatePalette from './components/CreatePalette';
import EditPalette from './components/EditPalette';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp'; // Import the SignUp component
import Footer from './components/Footer'; // Import the Footer component

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Toaster />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/palette/:id" element={<PaletteDetail />} />
            <Route path="/create" element={<CreatePalette />} />
            <Route path="/edit/:id" element={<EditPalette />} />
            <Route path="/sign-in" element={<SignIn />} /> {/* Route for sign-in */}
            <Route path="/sign-up" element={<SignUp />} /> {/* Route for sign-up */}
          </Routes>
        </div>
        <Footer /> {/* Add the Footer component here */}
      </div>
    </Router>
  );
}

export default App;
