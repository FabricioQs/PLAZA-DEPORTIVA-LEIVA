/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'light' | 'dark'; // light background or dark background
}

export default function BrandLogo({
  className = '',
  size = 'md',
  showText = true,
  variant = 'dark',
}: BrandLogoProps) {
  const dimensions = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-36 h-36',
    xl: 'w-56 h-56',
  }[size];

  return (
    <div className={`flex items-center justify-center shrink-0 ${dimensions} ${className}`} id="pdl-brand-logo-container">
      <img
        src="https://cnikfcehhfvgnpzpwotm.supabase.co/storage/v1/object/sign/IMAGENES/LOGO/LOGO%20PDL.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iMDFjN2VjYi05ZjEzLTQ2ZmUtYTk3OS1mZDRlNGYwMWZjYTciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJJTUFHRU5FUy9MT0dPL0xPR08gUERMLnBuZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODMzOTkxMDQsImV4cCI6MjA5ODc1OTEwNH0.irc8Nm1HRinWqkSV8A74rfF9zp866re6yU8gWSYCLrc"
        alt="Plaza Deportiva Leiva Logo"
        className="w-full h-full object-contain max-h-full"
        referrerPolicy="no-referrer"
        id="pdl-brand-logo-img"
      />
    </div>
  );
}
