import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface LightboxProps {
  src: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ src, isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !src) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.88)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        backdropFilter: 'blur(6px)',
        animation: 'lightboxIn .2s ease both',
      }}
      onClick={onClose}
    >
      <button
        onClick={e => { e.stopPropagation(); onClose(); }}
        style={{
          position: 'fixed',
          top: 20,
          right: 24,
          width: 40,
          height: 40,
          background: 'rgba(255,255,255,0.15)',
          border: '1.5px solid rgba(255,255,255,0.3)',
          borderRadius: '50%',
          color: 'white',
          fontSize: '1.1rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          transition: 'background .2s',
        }}
        aria-label="Close"
      >
        ✕
      </button>
      <img
        src={src}
        alt="Full view"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '88vw',
          maxHeight: '88vh',
          width: 'auto',
          height: 'auto',
          objectFit: 'contain',
          borderRadius: 8,
          boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
          cursor: 'default',
          display: 'block',
        }}
      />
    </div>,
    document.body
  );
};
