'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // Delay in milliseconds for staggered entrance
  direction?: 'up' | 'none';
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const el = ref.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  const offsetClass = direction === 'up' ? 'translate-y-6' : '';

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : `opacity-0 ${offsetClass} scale-[0.99]`
      } ${className}`}
    >
      {children}
    </div>
  );
};
