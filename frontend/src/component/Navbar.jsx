// Navbar.js
import React, { useEffect, useState } from 'react';
import { useTheme } from '../ThemeContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logo, setLogo] = useState([]);
  const { isDarkMode, toggleTheme } = useTheme();
  const URI = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getLogo = async () => {
    try {
      const resp = await axios.get(`${URI}/api/logo/`);
      setLogo(resp.data);
    } catch (error) {
      console.error('Error fetching logo:', error);
    }
  };

  const handleLogin = async () => {
    const { value: credentials } = await Swal.fire({
      title: 'Verify-admin',
      html:
        '<input id="password" type="password" class="swal2-input" placeholder="Enter secret Key">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Login',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const password = document.getElementById('password').value;
        return { password };
      }
    });

    if (credentials) {
      const { password } = credentials;

      // Static validation
      if (password === '1550') {
        navigate('/login-Bishnu');
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'You are not Admin',
          text: 'Invalid secret key.',
        });
      }
    }
  };

  useEffect(() => {
    getLogo();
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-md z-50`}>
      <nav className="flex items-center justify-between p-4 max-w-7xl mx-auto">
        {/* Logo */}
        <a href="#" className="flex items-center">
          {logo.length > 0 ? (
            logo.map((log) => (
              <img
                key={log.id}
                src={log.logo}
                alt="logo"
                className="h-6 w-full rounded-full object-cover"
              />
            ))
          ) : (
            <p>Loading logo...</p>
          )}
        </a>

        {/* Desktop Links */}
        <div className={`lg:flex space-x-5 ${isMenuOpen ? 'flex-col lg:hidden' : 'hidden'}`}>
          <a href="#home" className="hover:text-gray-900">Home</a>
          <a href="#about" className="hover:text-gray-900">About</a>
          <a href="#workexperience" className="hover:text-gray-900">Experience</a>
          <a href="#education" className="hover:text-gray-900">Education</a>
          <a href="#skills" className="hover:text-gray-900">Skills</a>
          <a href="#projects" className="hover:text-gray-900">Projects</a>
          <a href="#certificate" className="hover:text-gray-900">Certificate</a>
          <a href="#blog" className="hover:text-gray-900">Blogs</a>
          <a href="#contact" className="hover:text-gray-900">Contact</a>
          <button onClick={handleLogin} className="hover:text-gray-900">Login</button>
        </div>

        {/* Dark Mode Toggle */}
        <button onClick={toggleTheme} className="p-2">
          <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
        </button>

        {/* Hamburger Menu Button */}
        <button className="lg:hidden px-4 py-2" onClick={toggleMenu}>
          <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`fixed top-0 right-0 w-3/4 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} h-full shadow-lg lg:hidden z-50`}>
            <div className="flex justify-between items-center p-4">
              <button onClick={toggleMenu}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="flex flex-col items-center space-y-4 p-4">
              <a href="#home" onClick={toggleMenu} className="hover:text-gray-900">Home</a>
              <a href="#about" onClick={toggleMenu} className="hover:text-gray-900">About</a>
              <a href="#workexperience" onClick={toggleMenu} className="hover:text-gray-900">Experience</a>
              <a href="#education" onClick={toggleMenu} className="hover:text-gray-900">Education</a>
              <a href="#skills" onClick={toggleMenu} className="hover:text-gray-900">Skills</a>
              <a href="#projects" onClick={toggleMenu} className="hover:text-gray-900">Projects</a>
              <a href="#certificate" onClick={toggleMenu} className="hover:text-gray-900">Certificate</a>
              <a href="#blog" onClick={toggleMenu} className="hover:text-gray-900">Blogs</a>
              <a href="#contact" onClick={toggleMenu} className="hover:text-gray-900">Contact</a>
              <button onClick={() => { handleLogin(); toggleMenu(); }} className="hover:text-gray-900">Login</button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;