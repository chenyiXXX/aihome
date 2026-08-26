import React from 'react';

interface BrandLogoProps {
  className?: string;
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = 'h-8', showText = true }) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Red PA Monogram Badge */}
      <svg
        viewBox="0 0 100 100"
        className="h-8 w-8 shrink-0 drop-shadow-xs"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Red Rounded Rectangle Container */}
        <rect width="100" height="100" rx="22" fill="#D21415" />
        
        {/* White Stylized Connected PA Letterform */}
        {/* P stem & loop */}
        <path
          d="M20 28H50C58.8366 28 66 35.1634 66 44C66 52.8366 58.8366 60 50 60H20V28Z"
          stroke="white"
          strokeWidth="9.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 54V76"
          stroke="white"
          strokeWidth="9.5"
          strokeLinecap="round"
        />
        {/* A right diagonal leg */}
        <path
          d="M48 28L78 76"
          stroke="white"
          strokeWidth="9.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* A crossbar connecting with P */}
        <path
          d="M34 54H68"
          stroke="white"
          strokeWidth="9.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col justify-center min-w-0">
          <div className="flex items-center font-black text-[15px] leading-tight text-slate-900 tracking-tight font-sans">
            <span>品爱家居</span>
          </div>
          <div className="flex items-center text-[8.5px] font-bold text-slate-700 tracking-[0.18em] leading-none mt-0.5 whitespace-nowrap">
            <span className="scale-90 origin-left text-slate-500">— 全·系统定制 —</span>
          </div>
        </div>
      )}
    </div>
  );
};
