import React from 'react';
import Link from 'next/link';
import './footer.css';

export default function Footer() {
  return (
    <footer className="footer_wrapper">
      <div className="footer_container">
        <div>
          <h4 className="footer_column_title">Property Tap</h4>
          <p className="footer_text">
            Connecting property seekers directly with owners and listers. 0% brokerage, payment-ready real estate discovery platform.
          </p>
        </div>
        <div>
          <h4 className="footer_column_title">Quick Links</h4>
          <ul className="footer_links_list">
            <li><Link href="/properties" className="footer_link_item">Browse Properties</Link></li>
            <li><Link href="/dashboard/properties/new" className="footer_link_item">List Property (Free)</Link></li>
            <li><Link href="/pricing" className="footer_link_item">Pricing Plans</Link></li>
            <li><Link href="/safety" className="footer_link_item">Safety Guidelines</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="footer_column_title">Company</h4>
          <ul className="footer_links_list">
            <li><Link href="/about" className="footer_link_item">About Us</Link></li>
            <li><Link href="/contact" className="footer_link_item">Contact Us</Link></li>
            <li><Link href="/privacy" className="footer_link_item">Privacy Policy</Link></li>
            <li><Link href="/terms" className="footer_link_item">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer_bottom_bar">
        <span>&copy; {new Date().getFullYear()} Property Tap. All rights reserved.</span>
        <div className="footer_legal_links">
          <Link href="/privacy" className="footer_link_item">Privacy</Link>
          <Link href="/terms" className="footer_link_item">Terms</Link>
          <Link href="/safety" className="footer_link_item">Safety</Link>
        </div>
      </div>
    </footer>
  );
}
