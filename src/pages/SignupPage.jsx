import '../App.css'
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEyeSlash, faEye, faEnvelope } from "@fortawesome/free-solid-svg-icons";


function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [showAdminKey, setShowAdminKey] = useState(false);
  return (
    <div className="main-sp">

      <div className="singup-cont">

        <div className="signup-card">

          <h1 className="signup-title">
            ADMIN SIGN UP</h1>
            <p className='p-text'>Please fill in the details below to create an admin account.</p>

             {/* FULLNAME */}
          <div className="input-group">
            <label className='l-ue' htmlFor="Username">FULL NAME</label>

            <div className="input-box">
              <FontAwesomeIcon icon={faUser} className="left-icon" />
              <input type="text" placeholder="Enter Your Full Name" />
            </div>
          </div>


          {/* EMAIL */}
          <div className="input-group">
            <label className='l-ue' htmlFor="Username">EMAIL</label>

            <div className="input-box">
              <FontAwesomeIcon icon={faEnvelope} className="left-icon" />
              <input type="text" placeholder="Enter Your Email" />
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

          {/* CONFIRM PASSWORD */}
          <div className="input-group">
            <label className='l-cp' htmlFor="ConfirmPassword">CONFIRM PASSWORD</label>

            <div className="input-box">
              <FontAwesomeIcon icon={faLock} className="left-icon" />
              <input type= {showConfirmPassword ? "text" : "password"} placeholder='Confirm Your Password' />
              <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} className="right-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
            </div>
          </div>

          {/* ADMIN SECRET KEY */}
          <div className="input-group">
            <label className='l-ak' htmlFor="AdminSecretKey">ADMIN SECRET KEY</label>

            <div className="input-box">
              <FontAwesomeIcon icon={faLock} className="left-icon" />
              <input type= {showAdminKey ? "text" : "password"} placeholder='Enter Admin Secret Key' />
              <FontAwesomeIcon icon={showAdminKey ? faEye : faEyeSlash} className="right-icon"
              onClick={() => setShowAdminKey(!showAdminKey)} />
            </div>
          </div>
          
          
           {/* SIGN UP BUTTON */}
          <button className="signup-btn">Sign Up</button>

          ALREADY HAVE AN ACCOUNT? <a href="#" className="login-link">LOGIN</a>


        </div>

      </div>

    </div>

  )

}

export default SignupPage