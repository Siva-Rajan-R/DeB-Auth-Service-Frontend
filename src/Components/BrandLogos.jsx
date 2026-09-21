import React from 'react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

export const GoogleLogo = ({ size = 20, className = '' }) => (
  <FcGoogle size={size} className={className} />
);

export const GithubLogo = ({ size = 20, className = 'text-[#181717]' }) => (
  <FaGithub size={size} className={className} />
);

export const FacebookLogo = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#0866FF" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export const MicrosoftLogo = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 23 23" className={className}>
    <path fill="#f35325" d="M1 1h10v10H1z"/>
    <path fill="#81bc06" d="M12 1h10v10H1z"/>
    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
    <path fill="#ffba08" d="M12 12h10v10H1z"/>
  </svg>
);
