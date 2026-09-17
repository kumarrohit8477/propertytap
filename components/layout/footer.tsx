import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaLinkedinIn, FaInstagram, FaFacebookF, FaYoutube } from 'react-icons/fa';
import './footer.css';

export default function Footer() {
  return (
    <footer className="footer_wrapper">
      <div className="footer_main_container">
        {/* Left: Logo & Tagline */}
        <div className="footer_brand_section">
          <div className="footer_logo_wrapper">
            {/* Yahan aap baad mein apne logo ka path de sakte hain */}
            <Image 
             src="/assets/logo.png" 
              alt="Property Tap Logo" 
              width={28} 
              height={28} 
              className="footer_logo_img"
            />
            <span className="footer_brand_name">Property Tap</span>
          </div>
          <p className="footer_tagline">Spaces for a brighter tomorrow.</p>
        </div>

        {/* Center: Navigation Links */}
        <nav className="footer_nav_links">
          <Link href="/about" className="footer_nav_item">About</Link>
          <Link href="/how-it-works" className="footer_nav_item">How It Works</Link>
          <Link href="/blog" className="footer_nav_item">Blog</Link>
          <Link href="/support" className="footer_nav_item">Support</Link>
          <Link href="/contact" className="footer_nav_item">Contact</Link>
        </nav>

        {/* Right: Social Icons */}
        <div className="footer_social_icons">
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer_social_link" aria-label="LinkedIn">
            <FaLinkedinIn />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer_social_link" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer_social_link" aria-label="Facebook">
            <FaFacebookF />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer_social_link" aria-label="YouTube">
            <FaYoutube />
          </a>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Legal Links */}
      <div className="footer_bottom_bar">
        <span>&copy; {new Date().getFullYear()} Property Tap. All rights reserved.</span>
        <div className="footer_legal_links">
          <Link href="/terms" className="footer_legal_item">Terms</Link>
          <Link href="/privacy" className="footer_legal_item">Privacy</Link>
          <Link href="/sitemap" className="footer_legal_item">Sitemap</Link>
        </div>
      </div>
    </footer>
  );
}