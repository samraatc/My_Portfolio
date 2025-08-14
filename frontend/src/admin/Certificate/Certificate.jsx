import React, { useEffect, useState } from "react";
import UpdateCertificate from "./UpdateCertificate";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { Navbar } from "../../component/Navbar";
import { useTheme } from "../../ThemeContext";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

const Certificate = () => {
  const [certificates, setCertificates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const { isDarkMode } = useTheme();
  const navagite = useNavigate();

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/certificates/gettAllcertificates`
        );
        const data = await response.json();
        setCertificates(data);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      }
    };

    fetchCertificates();
  }, []);

  const handleUpdateCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    setShowModal(true);
  };

  const handleAddCertificate = () => {
    setSelectedCertificate(null);
    setShowModal(true);
  };

  const handleDeleteCertificate = async (certificate) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${certificate.name}. This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${BASE_URL}/api/certificates/delete/${certificate._id}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          setCertificates((prevCertificates) =>
            prevCertificates.filter((cert) => cert._id !== certificate._id)
          );
          Swal.fire(
            "Deleted!",
            `${certificate.name} has been deleted.`,
            "success"
          );
        } else {
          throw new Error("Failed to delete the certificate.");
        }
      } catch (error) {
        console.error("Error deleting certificate:", error);
        Swal.fire(
          "Error!",
          "There was an error deleting the certificate.",
          "error"
        );
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleBack = () => {
    navagite(-1);
  };

  return (
    <motion.div
      className="form-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {location.pathname === "/certificate" && <Navbar />}

      <div
        className={`flex justify-center items-center flex-col lg:px-0 md:mx-0 md:px-0 px-5 py-20 ${
          location.pathname === "/certificate"
            ? isDarkMode
              ? "bg-gray-900"
              : "bg-slate-100"
            : ""
        }`}
      >
        <div className="flex justify-between items-center w-full lg:px-32 ">
          <h1
  className={`lg:text-4xl text-2xl font-bold font-serif ${
    isDarkMode ? "text-gray-200" : "text-[#2C3E50]"
  }`}
>
  My Certificates
</h1>

         
          {location.pathname !== "/certificate" ? (
            <button
              onClick={handleAddCertificate}
              className="bg-pink-500 text-white font-semibold py-2 px-4 rounded shadow-md transition-all duration-300 ease-in-out transform hover:bg-blue-800 hover:shadow-lg hover:scale-105"
            >
              Add Certificate
            </button>
          ):( <button
            onClick={handleBack}
            className={`mb-6 text-white float-right ${
              isDarkMode
                ? "bg-blue-600 hover:bg-blue-800"
                : "bg-blue-500 hover:bg-blue-700"
            } p-2 px-5 rounded-md focus:outline-none`}
          >
            ⬅ Back
          </button>)}
        </div>

        <div className="w-full grid grid-cols-1 gap-8 lg:px-20 md:px-10 pl-8 py-5">
          {certificates.length > 0 ? (
            certificates.map((certificate, index) => (
              <div
                key={certificate._id}
                className={`flex flex-col lg:flex-row items-center rounded-lg overflow-hidden p-4  ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                <div
                  className={`w-full lg:w-1/2 flex justify-center mb-4 lg:mb-0`}
                >
                  <img
                    src={certificate.image || "https://via.placeholder.com/150"}
                    alt={certificate.name}
                    className="object-cover rounded-lg w-full h-full"
                  />
                </div>
                <div className="w-full lg:w-1/2 lg:px-20 md:px-10 px-5">
                  <p
                    className={`font-bold text-2xl md:text-4xl uppercase tracking-wide ${
                      isDarkMode ? "text-gray-200" : "text-gray-600"
                    }`}
                  >
                    {certificate.name}
                  </p>

                  <h1
                    className={`text-lg md:text-2xl my-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-800"
                    }`}
                  >
                    {certificate.organization}
                  </h1>

                  <div
                    className={`${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    } mb-4`}
                    dangerouslySetInnerHTML={{
                      __html: certificate.description,
                    }}
                  />

                  <p
                    className={`text-sm ml-2 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {formatDate(certificate.session.start)} -{" "}
                    {formatDate(certificate.session.end)}
                  </p>

                  <p
                    className={`text-base mt-2 text-center ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <strong>Issued Date:</strong>{" "}
                    {formatDate(certificate.issuedDate)}
                  </p>

                  {location.pathname !== "/certificate" && (
                    <div className="flex justify-center items-center content-center mt-4">
                      <button
                        onClick={() => handleUpdateCertificate(certificate)}
                        className="certificate-btn"
                      >
                        Update {certificate.name}
                      </button>
                      <button
                        onClick={() => handleDeleteCertificate(certificate)}
                        className="certificate-btn-delete"
                      >
                        Delete {certificate.name}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No certificates available.</p>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-75 z-50">
            <UpdateCertificate
              showModal={setShowModal}
              certificate={selectedCertificate}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Certificate;
