'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const NewsNavBar = () => {
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    async function checkNews() {
      try {
        const res = await fetch(
          `https://newsdata.io/api/1/news?apikey=${process.env.NEXT_PUBLIC_NEWDATA_API_KEY}&q=creator&language=en`
        );
        const data = await res.json();

        if (data.results && data.results.length > 0) {
          const latestDate = new Date(data.results[0].pubDate);
          const lastVisit = new Date(localStorage.getItem('lastVisit') || 0);

          if (latestDate > lastVisit) {
            setHasNew(true);
          }
        }

        localStorage.setItem('lastVisit', new Date().toISOString());
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    }

    checkNews();
  }, []);

  return (
    <Link href="/News" className="relative inline-block">
      What's New
      {hasNew && (
        <span className="absolute -top-1 -right-4 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
      )}
    </Link>
  );
};

export default NewsNavBar;
