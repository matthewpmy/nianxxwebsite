"use client";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <div
      className={`relative flex flex-col h-[100vh] items-center justify-center bg-zinc-50 text-slate-950 transition-bg ${className || ''}`}
      {...props}
    >
      <div 
        className="absolute inset-0 opacity-50 will-change-transform"
        style={{
          backgroundImage: 'repeating-linear-gradient(100deg, rgb(59, 130, 246) 0%, rgb(59, 130, 246) 7%, transparent 10%, transparent 12%, rgb(59, 130, 246) 16%), repeating-linear-gradient(100deg, rgb(59, 130, 246) 10%, rgb(129, 140, 248) 15%, rgb(167, 139, 250) 20%, rgb(196, 181, 253) 25%, rgb(96, 165, 250) 30%)',
          backgroundSize: '300%, 200%',
          backgroundPosition: '50% 50%, 50% 50%',
          filter: 'blur(10px)',
          animation: 'aurora 20s linear infinite'
        }}
      />
      {showRadialGradient && (
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: 'repeating-linear-gradient(100deg, rgb(59, 130, 246) 10%, rgb(129, 140, 248) 15%, rgb(167, 139, 250) 20%, rgb(196, 181, 253) 25%, rgb(96, 165, 250) 30%)',
            backgroundSize: '200%, 100%',
            backgroundPosition: '50% 50%, 50% 50%',
            maskImage: 'radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%)',
            animation: 'aurora 20s linear infinite reverse'
          }}
        />
      )}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.70) 0%, rgba(255,255,255,1) 60%)'
        }}
      />
      <style>{`
        @keyframes aurora {
          0% { background-position: 0% 50%, 50% 50%; }
          100% { background-position: 100% 50%, 50% 50%; }
        }
      `}</style>
      {children}
    </div>
  );
};
