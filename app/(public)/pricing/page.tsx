import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/button';
import './pricing.css';

export default function PricingPage() {
  return (
    <div className="pricing_page_container">
      <div className="pricing_header">
        <h1 className="pricing_title">Simple, Transparent Pricing</h1>
        <p className="pricing_subtitle">
          Enjoy <strong>₹0 Brokerage</strong> on all transactions. Take advantage of our initial launch offer to post property listings completely free!
        </p>
      </div>

      <div className="pricing_plans_grid">
        <div className="pricing_card pricing_card_featured">
          <span className="pricing_badge">100% OFF LAUNCH SPECIAL</span>
          <div className="pricing_plan_name">1 Month Listing</div>
          <div>
            <span className="pricing_amount">₹0</span>
            <span className="pricing_original_price">₹499</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Full property exposure for 30 days during our platform launch.
          </p>
          <ul className="pricing_features_list">
            <li className="pricing_feature_item">✅ 30 Days Active Listing</li>
            <li className="pricing_feature_item">✅ Multiple Image Uploads</li>
            <li className="pricing_feature_item">✅ Direct Contact Exchange via Notifications</li>
            <li className="pricing_feature_item">✅ ₹0 Brokerage</li>
            <li className="pricing_feature_item">✅ Dashboard Analytics</li>
          </ul>
          <Link href="/dashboard/properties/new" style={{ marginTop: 'auto' }}>
            <Button variant="primary" full_width={true}>
              Get Started Free
            </Button>
          </Link>
        </div>

        <div className="pricing_card">
          <div className="pricing_plan_name">3 Months Premium</div>
          <div>
            <span className="pricing_amount">₹1,199</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Extended visibility for maximum buyer reach.
          </p>
          <ul className="pricing_features_list">
            <li className="pricing_feature_item">✅ 90 Days Active Listing</li>
            <li className="pricing_feature_item">✅ Featured Feed Placement</li>
            <li className="pricing_feature_item">✅ Priority Notifications</li>
            <li className="pricing_feature_item">✅ ₹0 Brokerage</li>
          </ul>
          <div style={{ marginTop: 'auto' }}>
            <Button variant="secondary" full_width={true} disabled>
              Coming Soon
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
