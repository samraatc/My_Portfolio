import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "./Navbar";
import { Education } from "./Eduction";
import Skill from "./skill/Skill";
import { Project } from "./Project";
import { Footer } from "./Footer";
import { Profile } from "./Profile";
import ContactUs from "./ContactUs";
import WorkExperience from "./WorkExperience";
import { useTheme } from "../ThemeContext";
import { Aboutme } from "./Aboutme";
import { CertificateComponent } from "./CertificateComponent";
import { BlogComponent } from "./BlogComponent";
import { Slide } from "react-awesome-reveal";
import { useInView } from "react-intersection-observer";

const URI = import.meta.env.VITE_API_URL;

function Portfolio() {
  const { isDarkMode } = useTheme();
  const [userProfile, setUserProfile] = useState(null); // Initialize state

  // Load user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${URI}/api/users/getUser`);
        console.log("Fetched data:", response.data.users);
        setUserProfile(response.data.users);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const containerClasses = isDarkMode
    ? "font-sans text-gray-300 bg-gray-900"
    : "font-sans text-gray-800";

  const lightModeBackground = {
    backgroundImage:
      'url("https://img.freepik.com/free-photo/blue-toned-collection-paper-sheets-with-copy-space_23-2148320445.jpg?w=900&t=st=1709066598~exp=1709067198~hmac=c5c0995a7289d90e1e59f33310d419716d3975cedc8f97a8f31c119f7619dcaf")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    overflowX: "hidden",
    height: "100%",
    width: "100%",
  };

  const { ref: profileRef, inView: profileInView } = useInView({
    triggerOnce: true,
  });
  const { ref: aboutMeRef, inView: aboutMeInView } = useInView({
    triggerOnce: true,
  });
  const { ref: workExperienceRef, inView: workExperienceInView } = useInView({
    triggerOnce: true,
  });
  const { ref: educationRef, inView: educationInView } = useInView({
    triggerOnce: true,
  });
  const { ref: skillRef, inView: skillInView } = useInView({
    triggerOnce: true,
  });
  const { ref: projectRef, inView: projectInView } = useInView({
    triggerOnce: true,
  });
  const { ref: certificateRef, inView: certificateInView } = useInView({
    triggerOnce: true,
  });
  const { ref: blogRef, inView: blogInView } = useInView({ triggerOnce: true });

  // Show loader if profile data is not yet available
  if (!userProfile) {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen bg-gray-100 dark:bg-gray-900 animate-fadeIn">
      <div className="w-16 h-16 border-4 border-indigo-600 dark:border-white border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-800 dark:text-gray-200 text-lg animate-pulse">Loading...</p>
    </div>
  );
}


  return (
    <div
      className={containerClasses}
      style={!isDarkMode ? lightModeBackground : {}}
    >
      <Navbar />
      <main className="pt-[100px]">
        <Slide direction="left" triggerOnce when={profileInView}>
          <div ref={profileRef}>
            <Profile user={userProfile} />
          </div>
        </Slide>

        <Slide direction="right" triggerOnce when={aboutMeInView}>
          <div ref={aboutMeRef}>
            <Aboutme />
          </div>
        </Slide>

        <Slide direction="left" triggerOnce when={workExperienceInView}>
          <div ref={workExperienceRef}>
            <WorkExperience />
          </div>
        </Slide>

        <Slide direction="right" triggerOnce when={educationInView}>
          <div ref={educationRef}>
            <Education />
          </div>
        </Slide>

        <Slide direction="left" triggerOnce when={skillInView}>
          <div ref={skillRef}>
            <Skill />
          </div>
        </Slide>

        <Slide direction="right" triggerOnce when={projectInView}>
          <div ref={projectRef}>
            <Project />
          </div>
        </Slide>

        <Slide direction="left" triggerOnce when={certificateInView}>
          <div ref={certificateRef}>
            <CertificateComponent />
          </div>
        </Slide>

        <Slide direction="right" triggerOnce when={blogInView}>
          <div ref={blogRef}>
            <BlogComponent />
          </div>
        </Slide>
      </main>
      <ContactUs />
      <Footer />
    </div>
  );
}

export default Portfolio;
