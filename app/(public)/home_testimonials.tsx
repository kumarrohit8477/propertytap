import React from 'react';
import './home_testimonials.css';

const TESTIMONIALS = [
  {
    name: 'Amit Sharma',
    role: 'Property Seeker',
    avatar_img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    quote:
      '"Found my perfect apartment within a week. The platform is easy to use and really helpful."',
    stars: 5,
  },
  {
    name: 'Neha Verma',
    role: 'Property Owner',
    avatar_img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
    quote:
      '"Got genuine tenants quickly. PropertyTap made the whole process smooth and transparent."',
    stars: 5,
  },
  {
    name: 'Rohit Mehta',
    role: 'Business Owner',
    avatar_img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    quote:
      '"Rented my shop in no time. Great platform with verified users."',
    stars: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="htm_stars">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="0.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

export default function HomeTestimonials() {
  return (
    <section className="htm_section">
      <div className="htm_container">
        <div className="htm_header">
          <h2 className="htm_title">What Our Users Say</h2>
          <p className="htm_subtitle">Real stories from our happy users.</p>
        </div>
        <div className="htm_grid">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="htm_card">
              <div className="htm_user">
                <div className="htm_avatar">
                  <img src={t.avatar_img} alt={t.name} className="htm_avatar_img" />
                </div>
                <div>
                  <div className="htm_name">{t.name}</div>
                  <div className="htm_role">{t.role}</div>
                </div>
              </div>
              <Stars count={t.stars} />
              <p className="htm_quote">{t.quote}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
