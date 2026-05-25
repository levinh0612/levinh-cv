import React from 'react';
import { useCV } from '../../context/CVContext';
import { useInView } from '../../hooks/useInView';
import type { Language } from '../../types/cv';

interface LanguagesSectionProps {
  languages: Language[];
}

export const LanguagesSection: React.FC<LanguagesSectionProps> = ({ languages }) => {
  const { lang } = useCV();
  const { ref, inView } = useInView();

  if (!languages || languages.length === 0) return null;

  return (
    <div ref={ref} className={`mb-8 reveal${inView ? ' is-visible' : ''}`}>
      <div className="section-heading-block">
        <span>{lang === 'en' ? 'LANGUAGES' : 'NGÔN NGỮ'}</span>
      </div>
      <div className="languages-list">
        {languages.map((item, i) => (
          <div key={i} className="language-item">
            <span className="language-name">
              {lang === 'en' ? item.name : item.nameVi}
            </span>
            <span className="language-level">
              {lang === 'en' ? item.level : item.levelVi}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
