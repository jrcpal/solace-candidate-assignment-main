"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { GlobalStyle, ThemeToggleContainer, ThemeToggleButton } from "./styles";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    // Small delay to ensure styled-components are ready
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div 
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          backgroundColor: '#ffffff',
          fontFamily: 'Inter, sans-serif',
          zIndex: 9999
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          color: '#6b7280',
          fontSize: '1rem'
        }}>
          <div 
            style={{
              width: '2rem',
              height: '2rem',
              border: '3px solid #e5e7eb',
              borderTop: '3px solid #0a7753ff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} 
          />
          <div style={{
            fontFamily: 'Mollie Glaston, sans-serif',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#111827'
          }}>
            Solace Advocates
          </div>
        </div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <GlobalStyle $isDark={isDarkMode} />
      <ThemeToggleContainer>
        <ThemeToggleButton $isDark={isDarkMode} onClick={toggleTheme}>
          <span className="icon">
            {isDarkMode ? '☀️' : '🌙'}
          </span>
        </ThemeToggleButton>
      </ThemeToggleContainer>
      {children}
    </ThemeContext.Provider>
  );
}
