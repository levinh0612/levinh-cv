import React, { useState } from 'react';
import { Phone, Mail, Home, Globe } from 'lucide-react';
import { useCV } from '../context/CVContext';
import { Lightbox } from './Lightbox';
import type { PersonalInfo } from '../types/cv';

interface CVHeaderProps {
  personal: PersonalInfo;
}

export const CVHeader: React.FC<CVHeaderProps> = ({ personal }) => {
  const { lang } = useCV();
  const [avatarLightbox, setAvatarLightbox] = useState(false);

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return (parts[0] || 'CV').slice(0, 2).toUpperCase();
  };

  const jobTitle = lang === 'en' ? personal.jobTitle : personal.jobTitleVi;

  return (
    <>
      <div className="header-grid">
        <div className="header-left">
          <h1 className="name header-enter-1">{personal.fullName}</h1>
          <div className="job-title-line header-enter-2">{jobTitle}</div>

          <div className="header-meta header-enter-3">
            <span className="meta-chip">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {personal.dob}
            </span>
            <span className="meta-sep" />
            <span className="meta-chip">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              {personal.location}
            </span>
            {personal.hometown && (
              <>
                <span className="meta-sep" />
                <span className="meta-chip">
                  <Home size={11} />
                  {personal.hometown}
                </span>
              </>
            )}
          </div>

          <div className="contact-row header-enter-4">
            <a className="contact-item" href={`tel:${personal.phone}`}>
              <Phone size={11} />
              {personal.phone}
            </a>
            <span className="contact-sep" />
            <a className="contact-item" href={`mailto:${personal.email}`}>
              <Mail size={11} />
              {personal.email}
            </a>
            <span className="contact-sep" />
            <a className="contact-item" href={personal.linkedinUrl} target="_blank" rel="noopener noreferrer">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              {personal.linkedinDisplay}
            </a>
            {personal.portfolioUrl && (
              <>
                <span className="contact-sep" />
                <a className="contact-item" href={personal.portfolioUrl} target="_blank" rel="noopener noreferrer">
                  <Globe size={11} />
                  <span style={{ opacity: 0.6, marginRight: 2 }}>CV online:</span>
                  {personal.portfolioDisplay ?? personal.portfolioUrl}
                </a>
              </>
            )}
          </div>
        </div>

        <div className="header-avatar avatar-enter">
          {personal.avatarUrl ? (
            <img
              src={personal.avatarUrl}
              alt={personal.fullName}
              className="avatar-img"
              style={{ cursor: 'pointer' }}
              onClick={() => setAvatarLightbox(true)}
              title="Click to view"
            />
          ) : (
            <div className="avatar-placeholder">
              <span className="avatar-initials">{getInitials(personal.fullName)}</span>
            </div>
          )}
        </div>
      </div>

      <Lightbox
        src={personal.avatarUrl}
        isOpen={avatarLightbox}
        onClose={() => setAvatarLightbox(false)}
      />
    </>
  );
};
