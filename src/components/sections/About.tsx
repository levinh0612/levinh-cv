import React from 'react';
import { useCV } from '../../context/CVContext';
import { useInView } from '../../hooks/useInView';
import type { AboutSection as AboutSectionType } from '../../types/cv';

interface AboutSectionProps {
  about: AboutSectionType;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ about }) => {
  const { lang } = useCV();
  const { ref, inView } = useInView();
  if (!about) return null;
  const text = lang === 'en' ? about.en : about.vi;

  return (
    <div ref={ref} className={`mb-8 reveal${inView ? ' is-visible' : ''}`}>
      <div className="section-heading-block">
        <span>{lang === 'en' ? 'ABOUT ME' : 'GIỚI THIỆU'}</span>
      </div>
      <div className="about-card">
        <span className="about-quote" aria-hidden="true">&ldquo;</span>
        <p className="about-text">{text}</p>
      </div>
    </div>
  );
};
