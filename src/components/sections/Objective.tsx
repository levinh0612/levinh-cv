import React from 'react';
import { useCV } from '../../context/CVContext';
import { useInView } from '../../hooks/useInView';
import type { ObjectiveSection as ObjectiveSectionType } from '../../types/cv';

interface ObjectiveSectionProps {
  objective: ObjectiveSectionType;
}

function parseHighlights(text: string): React.ReactNode[] {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1
      ? <mark key={i} className="objective-highlight">{part}</mark>
      : part
  );
}

export const ObjectiveSection: React.FC<ObjectiveSectionProps> = ({ objective }) => {
  const { lang } = useCV();
  const { ref, inView } = useInView();
  const text = lang === 'en' ? objective.en : objective.vi;

  return (
    <div ref={ref} className={`mb-8 reveal${inView ? ' is-visible' : ''}`}>
      <div className="section-heading-block">
        <span>{lang === 'en' ? 'OBJECTIVE' : 'MỤC TIÊU NGHỀ NGHIỆP'}</span>
      </div>
      <div className="objective-card">
        <p className="objective-text">{parseHighlights(text)}</p>
      </div>
      {objective.impacts && (objective.impacts[lang] || []).length > 0 && (
        <ul className="impact-list">
          {(objective.impacts[lang]).map((item, i) => (
            <li key={i} className="impact-item">
              <span className="impact-arrow">→</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
