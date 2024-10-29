'use client';

import React, { useEffect, useRef, KeyboardEvent } from 'react';

interface AccessibilityProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProps> = ({ children }) => {
  const isUsingKeyboard = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        isUsingKeyboard.current = true;
        document.body.classList.add('using-keyboard');
      }
    };

    const handleMouseDown = () => {
      isUsingKeyboard.current = false;
      document.body.classList.remove('using-keyboard');
    };

    window.addEventListener('keydown', handleKeyDown as any);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown as any);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <>
      <SkipToContent />
      {children}
    </>
  );
};

export const SkipToContent = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black"
    >
      Skip to main content
    </a>
  );
};

export const FocusTrap = ({ children }: { children: React.ReactNode }) => {
  const startRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const handleStartTab = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && e.shiftKey) {
      e.preventDefault();
      endRef.current?.focus();
    }
  };

  const handleEndTab = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      startRef.current?.focus();
    }
  };

  return (
    <>
      <div tabIndex={0} ref={startRef} onKeyDown={handleStartTab} />
      {children}
      <div tabIndex={0} ref={endRef} onKeyDown={handleEndTab} />
    </>
  );
};