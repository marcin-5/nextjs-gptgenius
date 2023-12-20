'use client';
import { useState } from 'react';
import { BsMoonFill, BsSunFill } from 'react-icons/bs';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config.js';

const ThemeToggle = () => {
  const { daisyui } = resolveConfig(tailwindConfig);
  const [theme, setTheme] = useState(daisyui.themes[0]);

  const toggleTheme = () => {
    const newTheme =
      theme === daisyui.themes[0] ? daisyui.themes[1] : daisyui.themes[0];
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <button onClick={toggleTheme} className='btn btn-sm btn-outline'>
      {theme === daisyui.themes[0] ? (
        <BsMoonFill className='w-4 h-4' />
      ) : (
        <BsSunFill className='w-4 h-4' />
      )}
    </button>
  );
};

export default ThemeToggle;
