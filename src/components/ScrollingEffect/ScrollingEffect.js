import React, { useRef, useEffect, useState } from 'react';
import './ScrollingEffect.css';

const ScrollingEffect = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    // Function to attempt playing the video
    const attemptPlay = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Video is playing');
          })
          .catch(error => {
            console.warn('Video autoplay prevented:', error);
            // Video will play on user interaction due to muted attribute
          });
      }
    };

    // Try to play when video is loaded
    const handleLoadedData = () => {
      attemptPlay();
    };

    // Handle video errors
    const handleError = (e) => {
      console.error('Video error:', e);
      const error = video.error;
      if (error) {
        console.error('Video error code:', error.code);
        console.error('Video error message:', error.message);
      }
    };

    // Handle when video can start playing
    const handleCanPlay = () => {
      attemptPlay();
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);

    // Initial attempt to play
    attemptPlay();

    // Intersection Observer for scroll-triggered animation
    // This provides smooth scroll-based animation that works in all browsers
    const updateAnimation = (entry) => {
      const intersectionRatio = entry.intersectionRatio;
      
      // Calculate animation progress
      // Animation completes when the full video section is visible (100%)
      // Progress goes from 0 to 1 as intersectionRatio goes from 0 to 1
      const progress = intersectionRatio;
      
      // Interpolate values: from opacity 0.5/scale 0.5 to opacity 1/scale 1
      // Start animation when element enters viewport, complete when fully visible
      const opacity = 0.5 + (0.5 * progress);
      const scale = 0.5 + (0.5 * progress);
      
      // Apply animation styles
      video.style.opacity = opacity.toString();
      video.style.transform = `scale(${scale})`;
      video.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out';
      
      setIsInView(entry.isIntersecting);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          updateAnimation(entry);
        });
      },
      {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100), // 0 to 1 in 0.01 steps
        rootMargin: '0px'
      }
    );

    observer.observe(container);

    // Also handle scroll event for smoother animation
    const handleScroll = () => {
      if (container && video) {
        const rect = container.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementTop = rect.top;
        const elementHeight = rect.height;
        
        // Calculate how much of the element is visible
        const visibleTop = Math.max(0, -elementTop);
        const visibleBottom = Math.min(elementHeight, windowHeight - elementTop);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const intersectionRatio = Math.min(visibleHeight / elementHeight, 1);
        
        if (intersectionRatio > 0) {
          // Animation completes when full video is visible (100%)
          // Progress goes from 0 to 1 as intersectionRatio goes from 0 to 1
          const progress = intersectionRatio;
          const opacity = 0.5 + (0.5 * progress);
          const scale = 0.5 + (0.5 * progress);
          
          video.style.opacity = opacity.toString();
          video.style.transform = `scale(${scale})`;
        } else {
          // Reset to initial state when not in view
          video.style.opacity = '0.5';
          video.style.transform = 'scale(0.5)';
        }
      }
    };

    // Use scroll event for more responsive animation
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle video path for both development and production
  const getVideoPath = () => {
    const publicUrl = process.env.PUBLIC_URL || '';
    // Remove trailing slash if present, then add /img/
    const basePath = publicUrl.endsWith('/') ? publicUrl.slice(0, -1) : publicUrl;
    return `${basePath}/img/7186951_Kathak_Dancer_1920x1080.mp4`;
  };

  const videoPath = getVideoPath();

  return (
    <section className="scrolling-effect">
      <div className="div-container" ref={containerRef}>
        <video 
          ref={videoRef}
          src={videoPath}
          autoPlay 
          muted 
          loop 
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          className={isInView ? 'video-in-view' : ''}
        >
          <source src={videoPath} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  );
};

export default ScrollingEffect;