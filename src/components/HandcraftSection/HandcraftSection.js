import React from 'react';
import './HandcraftSection.css';

const HandcraftSection = () => {
  return (
    <section className="handcraft-section">
      <h2 className="common-heading center">HandCraft Design</h2>
      <p className="common-para center">Most people love our design.</p>

      <div className="handcraft-container">
        <div className="handcraft-item">
          <div>
            <a href="/shop">
              <img src="img/93cc167593f14ad0652725d72a9ddd59.jpg" alt="" />
            </a>
          </div>
        </div>
        <div className="center-div">
          <div className="handcraft-content">
            <h3 className="common-heading">CHARACTR.</h3>
            <div className="handcraft-content-center">
              <p>AT CHARACTR, OUR GOAL IS TO REDEFINE FASHION AS A MEDIUM FOR STORYTELLING, RESILIENCE, AND INDIVIDUALITY. BORN IN JANUARY 2024, CHARACTR WAS FOUNDED TO CELEBRATE THOSE WHO, DESPITE LIFE'S TRIALS—CAREER SHIFTS, PERSONAL STRUGGLES, OR MOMENTS OF DOUBT—RISE AND DECIDE TO BE IN THEIR CHARACTR.</p>
              <p>OUR GARMENTS ARE MORE THAN FASHION; THEY ARE SYMBOLS OF PERSEVERANCE, CAPTURING THE ESSENCE OF INDIVIDUALS WHO WAKE UP EVERY DAY, READY TO BE IN CHARACTR.</p>
            </div>
            <a className="handcraft-btn" href="/shop">
              Discover Our Craft
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HandcraftSection;