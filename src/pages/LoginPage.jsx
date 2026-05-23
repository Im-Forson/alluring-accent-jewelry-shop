import '../App.css'
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";


function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="main-lp bg-[linear-gradient(90deg,#f7e9ea_0%,#e9d4d2_40%,#d8b1ad_75%,#c7938f_100%)]">

      <div className="login-cont w-full h-full flex items-center justify-center">

        <div className="login-card w-[380px] md:w-[460px]    ">

          <h1 className="login-title">
            Admin Login</h1>

          {/* USERNAME OR EMAIL */}
          <div className="lg-input-group">
            <label className='l-ue' htmlFor="Username">USERNAME/EMAIL</label>

            <div className="input-box">
              <FontAwesomeIcon icon={faUser} className="left-icon" />
              <input type="text" placeholder="Enter Your Username or Email" />
            </div>
          </div>



          {/* PASSWORD */}
          <div className="lg-input-group">
            <label className='l-p' htmlFor="Password">PASSWORD</label>

            <div className="input-box">
              <FontAwesomeIcon icon={faLock} className="left-icon" />
              <input type= {showPassword ? "text" : "password"} placeholder='Enter Your Password' />
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} className="right-icon" 
              onClick={() => setShowPassword(!showPassword)} />


            </div>
          </div>


          {/* LOGIN BUTTON */}
          <button className="login-btn">Login</button>
          

        </div>

      </div>

    </div>

  )

}

export default LoginPage