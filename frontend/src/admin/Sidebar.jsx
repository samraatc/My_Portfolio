import React, { useState, useEffect } from 'react';
import {
  FaHouseUser,
  FaSignOutAlt,
  FaAngleLeft,
  FaAngleRight,
  FaFolderOpen
} from 'react-icons/fa';
import { GoProjectSymlink } from "react-icons/go";
import { GiSkills } from "react-icons/gi";
import { SiKnowledgebase } from "react-icons/si";
import { PiUsersFourBold, PiStudentBold } from "react-icons/pi";
import { MdCastForEducation } from "react-icons/md";
import axios from 'axios';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { GrCertificate } from "react-icons/gr";
import { LiaBlogSolid } from "react-icons/lia";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logo, setLogo] = useState([]);
  const [logoFile, setLogoFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const URI = import.meta.env.VITE_API_URL;

  const email = localStorage.getItem("email");
  const [userProfile] = useState({ email });

  // Sidebar toggle handler
  const toggleSidebar = () => setIsOpen(!isOpen);

  // Extract the id of the first logo if exists for update
  const logoId = logo.length > 0 ? logo[0]._id : null;

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login-Bishnu');
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Fetch logo(s) from backend
  const getLogo = async () => {
    try {
      const resp = await axios.get(`${URI}/api/logo/`);
      setLogo(resp.data);
    } catch (error) {
      console.error('Error fetching logo:', error);
      Swal.fire('Error', 'Unable to fetch logo!', 'error');
    }
  };

  // Create logo on backend
  const createLogo = async () => {
    if (!logoFile) {
      Swal.fire('Warning', 'Please select a logo file to upload.', 'warning');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('logo', logoFile);

      const resp = await axios.post(`${URI}/api/logo/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // If API returns the whole logo array, update accordingly
      setLogo(prev => [...prev, resp.data]); // Adjust based on your API response
      Swal.fire('Success', 'Logo uploaded successfully!', 'success');
    } catch (error) {
      console.error('Error creating logo:', error);
      Swal.fire('Error', 'Failed to upload logo!', 'error');
    }
  };

  // Update existing logo on backend
  const updateLogo = async () => {
    if (!logoFile) {
      Swal.fire('Warning', 'Please select a logo file to update.', 'warning');
      return;
    }
    if (!logoId) {
      Swal.fire('Error', 'No logo found to update.', 'error');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('logo', logoFile);

      const resp = await axios.put(`${URI}/api/logo/${logoId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Replace the logo in the state with updated one (assuming resp.data contains updated logo)
      setLogo([resp.data]);
      Swal.fire('Success', 'Logo updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating logo:', error);
      Swal.fire('Error', 'Failed to update logo!', 'error');
    }
  };

  // Load logos once
  useEffect(() => {
    getLogo();
  }, []);

  // Menu items
  const menuItems = [
    { label: 'Profile', icon: <FaHouseUser />, route: '/admin-dashboard' },
    { label: 'Skills', icon: <GiSkills />, route: '/skill' },
    { label: 'Projects', icon: <GoProjectSymlink />, route: '/projects' },
    { label: 'Experience', icon: <SiKnowledgebase />, route: '/experience' },
    { label: 'Education', icon: <PiStudentBold />, route: '/education' },
    { label: 'Certificate', icon: <GrCertificate />, route: '/admin-certificate' },
    { label: 'Blog', icon: <LiaBlogSolid />, route: '/blog' },
    { label: 'Go to Client', icon: <PiUsersFourBold />, route: '/' },
    { label: 'Logout', icon: <FaSignOutAlt />, action: handleLogout },
  ];

  return (
    <div className="sidebar-wrapper text-base font-semibold font-serif z-10">
      <div className={`sidebar ${isOpen ? 'open' : ''}`} id="sidebar">
        <ul>
          <div className="profile">
            {logo.length > 0 ? (
              logo.map((log) => (
                <img
                  key={log._id}
                  src={log.logo}
                  alt="logo"
                  className="h-10 w-10 rounded-full object-cover"
                />
              ))
            ) : (
              <p>No logo found. Please upload a logo.</p>
            )}
            <span className='over'>{userProfile?.email || 'Username'}</span>
          </div>

          <div className="indicator" id="indicator"></div>
          {menuItems.map((item, index) => (
            <li
              key={index}
              onClick={item.action ? item.action : () => navigate(item.route)}
              className="menu-item flex items-center cursor-pointer hover:bg-gray-200 rounded-lg p-2"
            >
              <i className="icon">{item.icon}</i>
              <span>{item.label}</span>
            </li>
          ))}
          <li
            onClick={openModal}
            className="menu-item flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
          >
            <i className="icon"><FaFolderOpen /></i>
            <span>Logo</span>
          </li>
        </ul>
      </div>

      <button className="toggle-btn" onClick={toggleSidebar} aria-label="Toggle Sidebar">
        <i className="icon">{isOpen ? <FaAngleLeft /> : <FaAngleRight />}</i>
      </button>

      {/* Modal for Logo upload / update */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <form
              onSubmit={async (e) => {
                e.preventDefault();

                if (logo.length > 0) {
                  await updateLogo();
                } else {
                  await createLogo();
                }
                closeModal();
              }}
            >
              <div className="mb-4">
                <label
                  className="block text-sm font-semibold mb-2"
                  htmlFor="logoUpload"
                >
                  Upload Logo
                </label>
                <input
                  type="file"
                  id="logoUpload"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files[0])}
                  className="border p-2 w-full"
                />
              </div>
              <div className="flex justify-between items-center gap-5">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {logo.length > 0 ? "Update Logo" : "Upload Logo"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Close Modal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
