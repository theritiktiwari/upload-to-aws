import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { useState, useEffect } from "react";
import Landing from "./Components/Landing";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Reset from "./Components/Reset";
import Verify from "./Components/Verify";

function App() {
  const websiteName = "Upload to AWS";
  const [user, setUser] = useState({});
  const token = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_WEBSITE_HOST}/api/getuser`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token
          }
        });
        const data = await res.json();
        if (data.type === "success")
          setUser(data.data);
      } catch (err) {
        // console.log(err);
      }
    }
    token && getUser();
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Landing websiteName={websiteName} user={user} />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Signup />} />
          <Route exact path="/reset" element={<Reset />} />
          <Route exact path="/verify/:id" element={<Verify />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
