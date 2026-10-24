import Image from 'next/image';
import './home_mobile_app.css';

export default function HomeMobileApp() {
  return (
    <section className="hma_section" aria-labelledby="hma_title">
      <div className="hma_container">
        <div className="hma_left" aria-hidden="true">
          <div className="hma_phone_glow" />
          <Image
            src="/assets/mockup.png"
            alt=""
            width={620}
            height={413}
            className="hma_mockup_img"
            priority
            sizes="(max-width: 900px) 90vw, 520px"
          />
        </div>

        <div className="hma_right">
          <div className="hma_tag">
            <Image src="/assets/logo.png" alt="" width={17} height={17} />
            <span>PropertyTap</span>
            <span className="hma_tag_blue">Mobile App</span>
          </div>

          <h2 className="hma_title" id="hma_title">Find Properties On The Go</h2>
          <p className="hma_desc">
            Download our mobile app to explore properties, save your favorites
            and connect directly with owners.
          </p>

          <div className="hma_store_btns">
            <a
              href="#google-play"
              className="hma_store_badge_link"
              aria-label="Get it on Google Play"
            >
              <Image
                src="/assets/play-store.png"
                alt="Get it on Google Play"
                width={160}
                height={55}
                className="hma_store_badge_img"
              />
            </a>
            <a
              href="#app-store"
              className="hma_store_badge_link"
              aria-label="Download on the App Store"
            >
              <Image
                src="/assets/app-store.png"
                alt="Download on the App Store"
                width={160}
                height={55}
                className="hma_store_badge_img"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
