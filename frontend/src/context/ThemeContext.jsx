import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        document.documentElement.classList.toggle('light-mode', theme === 'light');
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = useCallback((e) => {
        // Get click coordinates for the circular reveal origin
        const x = e?.clientX ?? window.innerWidth / 2;
        const y = e?.clientY ?? window.innerHeight / 2;

        // Calculate the max radius needed to cover the entire screen
        const endRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        // Set CSS custom properties for the animation origin
        document.documentElement.style.setProperty('--theme-x', `${x}px`);
        document.documentElement.style.setProperty('--theme-y', `${y}px`);
        document.documentElement.style.setProperty('--theme-r', `${endRadius}px`);

        // Use View Transitions API if available
        if (document.startViewTransition) {
            const transition = document.startViewTransition(() => {
                setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
            });
        } else {
            setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
        }
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
