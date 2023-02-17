import React from "react";
import Conversations from "../components/Conversations";
import Sidebar from "../components/Sidebar";

const Home = () => {
  return (
    <div className="home">
      <div className="container">
        <Sidebar />
        <Conversations />
      </div>
    </div>
  );
};

export default Home;
