import '../SignupPage.css';
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEyeSlash, faEye, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-hot-toast';

function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Unified form state management
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;

    // Basic frontend verification fields
    if (!username || !email || !password || !confirmPassword) {
      toast.error("Please fill in all layout credentials.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // Mock successful database creation action
    toast.success(`Admin account for ${username} created successfully!`);
    
    // Clear form entries on success
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
  };

  return (
    <div className="main-sp bg-[linear-gradient(90deg,#f7e9ea_0%,#e9d4d2_40%,#d8b1ad_75%,#c7938f_100%)]">

      <div className="background-glow glow-1"></div>
      <div className="background-glow glow-2"></div>

      <div className="singup-cont">
        <div className="signup-card">
          <h1 className="signup-title">ADMIN SIGN UP</h1>
          <p className='p-text'>Please fill in the details below to create an admin account.</p>

          <form onSubmit={handleSignupSubmit} noValidate>
            {/* USERNAME */}
            <div className="sup-input-group">
              <label className='signup-label' htmlFor="username">USERNAME</label>
              <div className="sup-input-box">
                <FontAwesomeIcon icon={faUser} className="sup-left-icon" />
                <input 
                  type="text" 
                  id="username"
                  name="username"
                  placeholder="Enter Your Username" 
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="sup-input-group">
              <label className='signup-label' htmlFor="email">EMAIL</label>
              <div className="sup-input-box">
                <FontAwesomeIcon icon={faEnvelope} className="sup-left-icon" />
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  placeholder="Enter Your Email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="sup-input-group">
              <label className='signup-label' htmlFor="password">PASSWORD</label>
              <div className="sup-input-box">
                <FontAwesomeIcon icon={faLock} className="sup-left-icon" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password"
                  name="password"
                  placeholder='Enter Your Password' 
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <FontAwesomeIcon 
                  icon={showPassword ? faEye : faEyeSlash} 
                  className="sup-right-icon" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowPassword(!showPassword)} 
                />
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="sup-input-group">
              <label className='signup-label' htmlFor="confirmPassword">CONFIRM PASSWORD</label>
              <div className="sup-input-box">
                <FontAwesomeIcon icon={faLock} className="sup-left-icon" />
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder='Confirm Your Password' 
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                <FontAwesomeIcon 
                  icon={showConfirmPassword ? faEye : faEyeSlash} 
                  className="sup-right-icon"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                />
              </div>
            </div>

            {/* SIGN UP BUTTON */}
            <button type="submit" className="signup-btn">Sign Up</button>
          </form>

          <div className="login-redirect-text" style={{ marginTop: '16px', fontSize: '13px', textAlign: 'center' }}>
            ALREADY HAVE AN ACCOUNT? <a href="/login" className="login-link">LOGIN</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;