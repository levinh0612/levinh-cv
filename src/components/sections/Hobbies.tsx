import React from 'react';
import { useCV } from '../../context/CVContext';
import { useInView } from '../../hooks/useInView';
import type { Hobby } from '../../types/cv';

interface HobbiesSectionProps {
  hobbies: Hobby[];
}

const HOBBY_ANIMATIONS: Record<string, string> = {
  '🎵': 'anim-pulse',
  '⚽': 'anim-spin',
  '💻': 'anim-blink',
  '🌿': 'anim-sway',
  '🧘': 'anim-breathe',
  '🏃': 'anim-run',
};

export const HobbiesSection: React.FC<HobbiesSectionProps> = ({ hobbies }) => {
  const { lang } = useCV();
  const { ref, inView } = useInView();

  return (
    <div ref={ref} className={`mb-0 reveal-stagger section-hobbies${inView ? ' is-visible' : ''}`}>
      <div className="section-heading-block">
        <span>{lang === 'en' ? 'HOBBIES & INTERESTS' : 'SỞ THÍCH'}</span>
      </div>
      <div className="hobby-flex">
        {hobbies.map((hobby, idx) => (
          <span key={idx} className="hobby-pill">
            <span className={`hobby-icon ${HOBBY_ANIMATIONS[hobby.icon] ?? ''}`}>
              {hobby.icon}
            </span>
            {lang === 'en' ? hobby.label : hobby.labelVi}
          </span>
        ))}
      </div>
    </div>
  );
};
