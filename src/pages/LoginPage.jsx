import React, { useState } from "react";
import { useNavigate } from "react-router";
import "../LoginPage.css";
import toast from "react-hot-toast";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faUser,
  faLock,
  faEye,
  faEyeSlash,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ADMIN CREDENTIALS
  const adminEmail = "admin@gmail.com";
  const adminPassword = "123456";

  const handleLogin = (e) => {
    e.preventDefault();

    setLoading(true);

    // SIMULATE API REQUEST
    setTimeout(() => {

      if (
        email === adminEmail &&
        password === adminPassword
      ) {

        localStorage.setItem("adminLoggedIn", "true");

        toast.success("Welcome Admin!", {
          duration: 2000,
          style: {
            borderRadius: "14px",
            background: "rgba(20,20,20,0.9)",
            color: "#fff",
            backdropFilter: "blur(10px)",
            padding: "14px 18px",
          },
        });

        navigate("/dashboard");

      } else {

        toast.error("Wrong Credentials", {
          duration: 2000,
          style: {
            borderRadius: "14px",
            background: "rgba(20,20,20,0.9)",
            color: "#fff",
            backdropFilter: "blur(10px)",
            padding: "14px 18px",
            border: "1px solid rgba(255,255,255,0.1)",
          },
          iconTheme: {
            primary: "#ff4b4b",
            secondary: "#fff",
          },
        });

      }

      setLoading(false);

    }, 1500);
  };

  return (

    <div className="login-page bg-[linear-gradient(90deg,#f7e9ea_0%,#e9d4d2_40%,#d8b1ad_75%,#c7938f_100%)]">

      <div className="background-glow glow-1"></div>
      <div className="background-glow glow-2"></div>

      <form onSubmit={handleLogin}>

        <h1 className="login-title">
          Admin Login
        </h1>

        <p className="login-subtitle">
          Don't have an account?{" "}
          <span
            className="signup-link"
            onClick={() => navigate("/signup")}
          >
            <a href="/signup">Sign up</a>
          </span>
        </p>


        {/* EMAIL */}

        <div className="lg-input-group">

          <label> <strong>Username</strong> </label>

          <div className="lg-input-box">

            <FontAwesomeIcon
              icon={faUser}
              className="lg-left-icon"
            />

            <input
              type="email"
              name="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

          </div>

        </div>



        {/* PASSWORD */}

        <div className="lg-input-group">

          <label> <strong>Password</strong> </label>

          <div className="lg-input-box">

            <FontAwesomeIcon
              icon={faLock}
              className="lg-left-icon"
            />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <FontAwesomeIcon
              icon={showPassword ? faEye : faEyeSlash}
              className="lg-right-icon"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            />

          </div>

        </div>



        {/* BUTTON */}

        <button
          type="submit"
          className="login-btn"
          disabled={loading}
        >

          {loading ? (

            <span className="btn-loading">

              <FontAwesomeIcon
                icon={faSpinner}
                spin
              />

              Logging in...

            </span>

          ) : (

            "Login"

          )}

        </button>

      </form>

    </div>

  );
}

export default Login;