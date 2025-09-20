import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RoomPage from "./pages/RoomPage";

export default function App(){
  const [theme, setTheme] = useState('light');

  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);


  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home theme={theme} toggleTheme={toggleTheme}/>} />
          <Route path="/room/:id" element={<RoomPage theme={theme} toggleTheme={toggleTheme}/>} />
        </Routes>
      </main>

      <footer className="p-3 sm:p-4 text-center text-xs sm:text-sm text-gray-400">
        Built with ♥ — demo whiteboard
      </footer>
    </div>
  );
}
