import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-main-title">The Rangaara Story: Where Heritage Meets Horizon</h1>
          <p className="about-intro">
            In a world where fashion moves at the speed of trends, Rangaara stands as a bridge—connecting 
            the timeless artistry of Indian craftsmanship with the dynamic pulse of global style. We are not 
            just a brand; we are curators of culture, storytellers of tradition, and pioneers of a new 
            narrative where heritage finds its place on the world stage.
          </p>
        </div>
      </section>

      {/* Full-width Image Section - International Model */}
      <section className="about-image-section">
        <div className="about-image-container">
          <img 
            src={process.env.PUBLIC_URL + "/img/pexels-vikashkr50-27103969.jpg"} 
            alt="Rangaara clothing on international model" 
            className="about-hero-image"
          />
        </div>
      </section>

      {/* Story Content */}
      <section className="about-content">
        <div className="about-content-wrapper">
          <div className="about-text-block">
            <h2>Our Heritage</h2>
            <p>
              Every thread in a Rangaara piece tells a story—a story woven by skilled artisans who have 
              inherited techniques passed down through generations. From the intricate zardozi work of 
              Lucknow to the vibrant block prints of Rajasthan, from the delicate kantha embroidery of 
              Bengal to the luxurious silk weaves of Varanasi, our collections honor the diverse 
              craftsmanship that defines Indian textile artistry.
            </p>
            <p>
              We work directly with artisan communities, ensuring that every purchase supports not just 
              a product, but a legacy. Our commitment to ethical sourcing means that the hands that create 
              our garments are respected, fairly compensated, and celebrated. When you wear Rangaara, you 
              wear a piece of living history, crafted with care and intention.
            </p>
          </div>

          {/* Artisan Image Section */}
          <div className="about-image-section-inline">
            <img 
              src={process.env.PUBLIC_URL + "/img/93cc167593f14ad0652725d72a9ddd59.jpg"} 
              alt="Indian artisan weaving process" 
              className="about-inline-image"
            />
          </div>

          <div className="about-text-block">
            <h2>Our Vision</h2>
            <p>
              Rangaara was born from a simple yet powerful vision: to make Indian heritage accessible, 
              relevant, and irresistible to a global audience. We believe that traditional craftsmanship 
              should not be confined to regional markets or special occasions. Instead, it should be 
              integrated into everyday wardrobes, celebrated in international fashion weeks, and recognized 
              as a symbol of sophisticated, conscious luxury.
            </p>
            <p>
              Our designs are a dialogue between the old and the new. We take classic silhouettes and 
              reimagine them for contemporary life. A lehenga becomes a statement piece for a modern 
              wedding. A kurta transforms into elegant everyday wear. A dupatta finds new life as a 
              versatile accessory. Through thoughtful design, we make heritage wearable, relatable, and 
              revolutionary.
            </p>
          </div>

          {/* Brand Philosophy Blockquote */}
          <blockquote className="about-philosophy">
            <p className="philosophy-text">
              We bridge the gap between the artisan's loom and the global runway, between tradition and 
              innovation, between local craft and international appeal. Rangaara is where heritage meets 
              horizon—where every piece is a testament to the beauty of cultural fusion and the power of 
              timeless design.
            </p>
          </blockquote>

          <div className="about-text-block">
            <h2>Our Promise</h2>
            <p>
              When you choose Rangaara, you are choosing more than clothing. You are choosing quality 
              that stands the test of time, craftsmanship that honors tradition, and design that speaks 
              to the modern world. You are choosing to support ethical practices, preserve cultural 
              heritage, and celebrate the artistry that makes Indian fashion truly extraordinary.
            </p>
            <p>
              Join us on this journey as we continue to weave stories, bridge cultures, and create a 
              fashion legacy that honors both our past and our future. Welcome to Rangaara—where every 
              thread connects you to a world of heritage, elegance, and endless possibility.
            </p>
          </div>

          {/* Third Image Section */}
          <div className="about-image-section-inline">
            <img 
              src={process.env.PUBLIC_URL + "/img/64daf4c38576b7864fb170228f26c2fc.jpg"} 
              alt="Rangaara craftsmanship detail" 
              className="about-inline-image"
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="about-cta">
        <div className="about-cta-content">
          <h2>Explore The Collection</h2>
          <p>Discover pieces that honor tradition while embracing the future</p>
          <a href="/shop" className="about-cta-button">Discover Our Craft</a>
        </div>
      </section>
    </div>
  );
};

export default About;

