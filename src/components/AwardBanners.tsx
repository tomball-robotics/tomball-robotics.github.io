import React, { useState, useEffect } from 'react';
import { bannersData } from '@/data/bannersData';
import '@/assets/banner/banners.css';
import firstLogo from '@/assets/banner/first.svg';

const BANNER_WIDTH_WITH_MARGIN = 104; // 100px width + 4px margin
const CONTAINER_HORIZONTAL_PADDING = 32; // 1rem (16px) on each side

const AwardBanners: React.FC = () => {
  const [numberOfBanners, setNumberOfBanners] = useState(bannersData.length);

  useEffect(() => {
    const handleResize = () => {
      const availableWidth = window.innerWidth - CONTAINER_HORIZONTAL_PADDING;
      const count = Math.floor(availableWidth / BANNER_WIDTH_WITH_MARGIN);
      // Ensure we don't show a negative number of banners or more than available.
      setNumberOfBanners(Math.max(0, Math.min(count, bannersData.length)));
    };

    // Calculate on initial render and on resize
    handleResize();
    window.addEventListener('resize', handleResize);

    // Cleanup listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const bannersToShow = bannersData.slice(0, numberOfBanners);

  return (
    <div 
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 5,
        textAlign: 'center',
        overflow: 'hidden', // Prevent any accidental overflow
      }}
    >
      <ul 
        className="banners" 
        style={{ 
          display: 'inline-block', 
          padding: '0 1rem', 
          marginBottom: '0',
          whiteSpace: 'nowrap', // Keep banners in a single line
        }}
      >
        {bannersToShow.map((banner) => (
          <li key={banner.id}>
            <img src={firstLogo} alt="FIRST Logo" />
            <div>{banner.year}</div>
            <div>{banner.text}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AwardBanners;