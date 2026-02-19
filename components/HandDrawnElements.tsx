"use client";

import React from "react";

export const HandDrawnArrow = ({ className = "" }: { className?: string }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 200 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 50 Q 60 30, 100 45 T 180 50"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M 175 45 L 185 50 L 175 55"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
};

export const HandDrawnUnderline = ({
  className = "",
}: {
  className?: string;
}) => {
  return (
    <svg
      className={className}
      viewBox="0 0 300 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        d="M5 12 Q 75 8, 150 10 T 295 12"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
};

export const HandDrawnCircle = ({ className = "" }: { className?: string }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 50 10 C 73 12, 88 28, 90 50 C 88 73, 72 88, 50 90 C 27 88, 12 72, 10 50 C 12 27, 28 12, 50 10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />
    </svg>
  );
};

export const HandDrawnStar = ({ className = "" }: { className?: string }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M50 15 L58 40 L85 42 L65 60 L72 85 L50 70 L28 85 L35 60 L15 42 L42 40 Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
        opacity="0.3"
      />
    </svg>
  );
};

export const HandDrawnScribble = ({
  className = "",
}: {
  className?: string;
}) => {
  return (
    <svg
      className={className}
      viewBox="0 0 150 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 20 75 Q 35 60, 50 75 T 80 75 Q 95 90, 110 75 T 130 75"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.3"
      />
      <path
        d="M 25 85 Q 40 70, 55 85 T 85 85 Q 100 100, 115 85 T 135 85"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.25"
      />
    </svg>
  );
};

export const DoodleBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      <HandDrawnCircle className="absolute top-10 left-10 w-24 h-24 text-green-500 animate-float-slow" />
      <HandDrawnStar className="absolute top-32 right-20 w-16 h-16 text-yellow-500 animate-float-medium" />
      <HandDrawnScribble className="absolute bottom-20 left-1/4 w-32 h-32 text-blue-400 animate-float-fast" />
      <HandDrawnCircle className="absolute bottom-32 right-1/3 w-20 h-20 text-pink-400 animate-float-medium" />
      <HandDrawnStar className="absolute top-1/2 left-1/3 w-12 h-12 text-purple-400 animate-float-slow" />
    </div>
  );
};
