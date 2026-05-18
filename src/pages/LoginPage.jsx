import '../App.css'
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";


function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="main-lp">

      <div className="login-cont">

        <div className="login-card">

          <h1 className="login-title">
            Admin Login</h1>
            
            {/* DONT HAVE AN ACCOUNT? SIGN UP */}
          <p className="signup-link">
            Don't have an account? <a href="#">Sign Up</a>
          </p>


          {/* USERNAME OR EMAIL */}
          <div className="input-group">
            <label className='l-ue' htmlFor="Username">USERNAME/EMAIL</label>

            <div className="input-box">
              <FontAwesomeIcon icon={faUser} className="left-icon" />
              <input type="text" placeholder="Enter Your Username or Email" />
            </div>
          </div>



          {/* PASSWORD */}
          <div className="input-group">
            <label className='l-p' htmlFor="Password">PASSWORD</label>

            <div className="input-box">
              <FontAwesomeIcon icon={faLock} className="left-icon" />
              <input type= {showPassword ? "text" : "password"} placeholder='Enter Your Password' />
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} className="right-icon" 
              onClick={() => setShowPassword(!showPassword)} />


            </div>
          </div>



          {/* FORGOT PASSWORD */}
          <div className="forgot-password">
            <a href="#">Forgot Password?</a>
          </div>



          {/* LOGIN BUTTON */}
          <button className="login-btn">Login</button>



          {/* CHECKBOX */}
          <div className="checkbox">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Stay Logged In</label>
          </div>

        </div>

      </div>

    </div>

  )

}

export default LoginPage