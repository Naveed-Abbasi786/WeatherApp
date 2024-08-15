import React, { useState, useEffect } from 'react';

export default function DateTime({ temperature }) {
  const [currentDateTime, setCurrentDateTime] = useState({
    time: new Date().toLocaleTimeString(),
    date: new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime({
        time: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className='DateTime'>
      <h2>{currentDateTime.time}</h2>
      <div className='date'>
        <h4>{currentDateTime.date}</h4>
        <h1>{temperature}</h1>
      </div>
    </div>
  );
}
