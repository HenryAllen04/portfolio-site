/**
 * Purpose: Displays an animated analog clock with hour, minute, and second hands
 * Prevents hydration mismatches by ensuring server and client render identical content initially
 */
"use client";

import { useEffect, useState } from 'react';

export default function Clock() {
  const [time, setTime] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set initial time and mark as client-side
    setIsClient(true);
    setTime(new Date());
    
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Don't render dynamic content until client-side hydration is complete
  if (!isClient || !time) {
    return (
      <div className="clock">
        <div className="clock-hand clock-second" style={{ transform: "rotate(0deg)" }} />
        <div className="clock-hand clock-minute" style={{ transform: "rotate(0deg)" }} />
        <div className="clock-hand clock-hour" style={{ transform: "rotate(0deg)" }} />
      </div>
    );
  }

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondDeg = (seconds / 60) * 360;
  const minuteDeg = ((minutes / 60) * 360) + ((seconds / 60) * 6);
  const hourDeg = ((hours / 12) * 360) + ((minutes / 60) * 30);

  return (
    <div className="clock">
      <div 
        className="clock-hand clock-second" 
        style={{ transform: `rotate(${secondDeg}deg)` }}
      />
      <div 
        className="clock-hand clock-minute" 
        style={{ transform: `rotate(${minuteDeg}deg)` }}
      />
      <div 
        className="clock-hand clock-hour" 
        style={{ transform: `rotate(${hourDeg}deg)` }}
      />
    </div>
  );
}