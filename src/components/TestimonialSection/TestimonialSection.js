import React from 'react';
import './TestimonialSection.css';

const TestimonialSection = () => {
  const testimonials = [
    {
      id: 1,
      text: "The quality and craftsmanship are exceptional. Every piece tells a story and I feel confident wearing CHARACTR designs.",
      name: "Priya Sharma",
      location: "Mumbai",
      avatar: "PS"
    },
    {
      id: 2,
      text: "Absolutely love the handcraft designs! The attention to detail is amazing and the fit is perfect. Highly recommend!",
      name: "Ananya Patel",
      location: "Delhi",
      avatar: "AP"
    },
    {
      id: 3,
      text: "CHARACTR has become my go-to brand for unique fashion. The designs are bold, beautiful, and truly one-of-a-kind.",
      name: "Riya Mehta",
      location: "Bangalore",
      avatar: "RM"
    }
  ];

  // Duplicate testimonials for seamless loop
  const allTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="testimonial-section">
      <div className="testimonial-header">
        <h2 className="common-heading center testimonial-heading">What Our Customers Say</h2>
        <p className="common-para center testimonial-subtitle">Real stories from people who love our designs.</p>
      </div>
      
      <div className="testimonial-wrapper">
        <div className="testimonial-container">
          {allTestimonials.map((testimonial, index) => (
            <div key={`${testimonial.id}-${index}`} className={`testimonial-card testimonial-card-${testimonial.id}`}>
              <div className="quote-icon">
                <i className="fa-solid fa-quote-left"></i>
              </div>
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fa-solid fa-star"></i>
                ))}
              </div>
              <p className="testimonial-text">{testimonial.text}</p>
              <div className="testimonial-author">
                <div className="author-avatar">{testimonial.avatar}</div>
                <div className="author-info">
                  <h4 className="testimonial-name">{testimonial.name}</h4>
                  <p className="testimonial-location">
                    <i className="fa-solid fa-location-dot"></i> {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;