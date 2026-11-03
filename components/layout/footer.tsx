import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import './footer.css';

export default function Footer() {
  return (
    <footer className="footer_wrapper">
      <div className="footer_main">
        {/* Col 1: Brand */}
        <div className="footer_col footer_brand_col">
          <div className="footer_logo_row">
            <Image src="/assets/logo.png" alt="PropertyTap" width={28} height={28} className="footer_logo_img" />
            <span className="footer_brand_name">Property<span className="footer_logo_blue">Tap</span></span>
          </div>
          <p className="footer_tagline">
            Your trusted real estate platform for buying, renting and exploring properties.
          </p>
        </div>

        {/* Col 2: Quick Links */}
        <div className="footer_col">
          <h4 className="footer_col_heading">Quick Links</h4>
          <nav className="footer_links">
            <Link href="/" className="footer_link">Home</Link>
            <Link href="/properties" className="footer_link">Properties</Link>
            <Link href="/about" className="footer_link">About Us</Link>
            <Link href="/contact" className="footer_link">Contact</Link>
          </nav>
        </div>

        {/* Col 3: Support */}
        <div className="footer_col">
          <h4 className="footer_col_heading">Support</h4>
          <nav className="footer_links">
            <Link href="/support" className="footer_link">Help Center</Link>
            <Link href="/terms" className="footer_link">Terms & Conditions</Link>
            <Link href="/privacy" className="footer_link">Privacy Policy</Link>
            <Link href="/support" className="footer_link">FAQs</Link>
          </nav>
        </div>

        {/* Col 4: Follow Us */}
        <div className="footer_col">
          <h4 className="footer_col_heading">Follow Us</h4>
          <div className="footer_social_row">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer_social_icon footer_social_fb" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://www.instagram.com/propertytap_india" target="_blank" rel="noopener noreferrer" className="footer_social_icon footer_social_ig" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://www.linkedin.com/company/propertytap" target="_blank" rel="noopener noreferrer" className="footer_social_icon footer_social_li" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer_social_icon footer_social_yt" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer_bottom">
        <span>© {new Date().getFullYear()} PropertyTap. All rights reserved.</span>
      </div>
    </footer>
  );
}