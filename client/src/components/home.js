import React from "react";
import { useHistory } from "react-router-dom";

const rootStyle = {
  display: "flex",
  position: "absolute",
  transform: "translate(-50%, -50%)",
  top: "50%",
  left: "50%",
};

const buttonStyle = {
  margin: "20px",
  width: "100px",
  padding: "20px",
};

const Home = () => {
  const history = useHistory();

  return (
    <div style={rootStyle}>
      <button style={buttonStyle} onClick={() => history.push("/client")}>
        CLIENT
      </button>
      <button style={buttonStyle} onClick={() => history.push("/firm")}>
        FIRM
      </button>
    </div>
  );
};

export default Home;
