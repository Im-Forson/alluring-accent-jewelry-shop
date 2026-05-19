import '../App.css'
import { FaInstagram, FaFacebookF, FaWhatsapp, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaPinterestP, FaTiktok } 
from "react-icons/fa";
import logo from '../assets/logo.png'

export default function Footer() {
    return (
         <footer className="footer">
            <div class="flex flex-row justify-center items-center gap-1 py-[2px] bg-pink-200 "></div>
        
          <div className="footer-container" >
        
            {/* BRAND SECTION */}
            <div className="footer-brand">
                <img src={logo} alt="Alluring Accent Logo" className="w-[150px]" />
        
              <p className="copyright">
                © 2025 ALLURING ACCENT SHOP. All Rights Reserved.
              </p>
            </div>
        
            {/* QUICK LINKS */}
            <div className="footer-links">
              <h3>QUICK LINKS</h3>
        
              <a href="#">Home</a>
              <a href="#">Shop</a>
              <a href="#">Contact</a>
            </div>
        
            {/* CUSTOMER CARE */}
            <div className="footer-links">
              <h3>CUSTOMER CARE</h3>
        
              <a href="#">FAQs</a>
              <a href="#">Shipping & Delivery</a>
              <a href="#">Track Order</a>
            </div>
        
            {/* CONTACT */}
            <div className="footer-links">
              <h3>CONTACT US</h3>
              <p>+233 20 000 0000</p>
              <p>alluringaccent@gmail.com</p>
              <p>Accra, Ghana</p>
            </div>
        
            {/* SOCIALS */}
            <div className="footer-links">
              <h3>FOLLOW US</h3>
              <div className="social-icons">
                < FaInstagram />
                <FaFacebookF />
                <FaTiktok />
                <FaPinterestP />
              </div>
        
        
        
            </div>
        
          </div>
        </footer>
                
                
            
    )
}