import React, { useState, useEffect } from 'react';
import '@/assets/banner/banners.css';
import firstLogo from '@/assets/banner/first.svg';
import { supabase } from '@/integrations/supabase/client';
import { Banner } from '@/types/supabase'; // Import the new type

const BANNER_WIDTH_WITH_MARGIN = 104; // 100px width + 4px margin
const CONTAINER_HORIZONTAL_PADDING = 32; // 1rem (16px) on each side

const AwardBanners: React.FC = () => {
  const [bannersData, setBannersData] = useState<Banner[]>([]);
  const [numberOfBanners, setNumberOfBanners] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .order("year", { ascending: false }) // Order by year descending
        .order("created_at", { ascending: false }); // Consistent order for same year

      if (error) {
        console.error("Error fetching banners:", error);
        setError("Failed to load banners.");
      } else {
        setBannersData(data || []);
      }
      setLoading(false);
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const availableWidth = window.innerWidth - CONTAINER_HORIZONTAL_PADDING;
      const count = Math.floor(availableWidth / BANNER_WIDTH_WITH_MARGIN);
      setNumberOfBanners(Math.max(0, Math.min(count, bannersData.length)));
    };

    if (!loading && !error) {
      handleResize(); // Calculate on initial render after data is loaded
      window.addEventListener('resize', handleResize);
    }

    return () => window.removeEventListener('resize', handleResize);
  }, [bannersData, loading, error]); // Recalculate when bannersData changes or loading state changes

  const bannersToShow = bannersData.slice(0, numberOfBanners);

  if (loading) {
    return null; // Or a small loading indicator if desired
  }

  if (error) {
    console.error("Error displaying award banners:", error);
    return null; // Don't display banners if there's an error
  }

  if (bannersToShow.length === 0) {
    return null; // Don't render if no banners to show
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 5,
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      <ul
        className="banners"
        style={{
          display: 'inline-block',
          padding: '0 1rem',
          marginBottom: '0',
          whiteSpace: 'nowrap',
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