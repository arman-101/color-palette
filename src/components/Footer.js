import React from 'react';
import { Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto flex flex-col items-center">
        {/* Social Media Icons */}
        <div className="flex space-x-6 mb-4">
          {/* eslint-disable-next-line */}
          <a href="#" className="text-blue-400 hover:text-blue-500 transition">
            
            <Twitter size={24} />
          </a>
          {/* eslint-disable-next-line */}
          <a href="#" className="text-pink-500 hover:text-pink-600 transition">
            <Instagram size={24} />
          </a>
        </div>

        {/* Copyright Text */}
        <p className="text-gray-400 text-sm">
          &copy; {currentYear} PalettePicker
        </p>
      </div>
    </footer>
  );
};

export default Footer;
