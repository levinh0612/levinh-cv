import React from 'react';
import { useCV } from '../../context/CVContext';
import { useInView } from '../../hooks/useInView';
import type { EducationInfo } from '../../types/cv';

interface EducationSectionProps {
  education: EducationInfo;
}

export const EducationSection: React.FC<EducationSectionProps> = ({ education }) => {
  const { lang } = useCV();
  const { ref, inView } = useInView();

  return (
    <div ref={ref} className={`mb-8 reveal section-education${inView ? ' is-visible' : ''}`}>
      <div className="section-heading-block">
        <span>{lang === 'en' ? 'EDUCATION' : 'HỌC VẤN'}</span>
      </div>
      <div className="edu-card">
        <div className="edu-card-top">
          <span className="edu-school">{education.school}</span>
          <span className="edu-period-badge">{education.period}</span>
        </div>
        {education.degree && (
          <div className="edu-degree-row">
            <span className="edu-degree-text">
              {lang === 'en' ? education.degree : (education.degreeVi ?? education.degree)}
            </span>
            {education.classification && (
              <span className="edu-classification">
                {lang === 'en' ? education.classification : (education.classificationVi ?? education.classification)}
              </span>
            )}
          </div>
        )}
        <div className="edu-card-body">
          <div className="edu-field">
            <span className="edu-field-label">{lang === 'en' ? 'Major' : 'Chuyên ngành'}</span>
            {education.major} · {education.subject}
          </div>
          <div className="gpa-badge">GPA&nbsp;&nbsp;{education.gpa}</div>
        </div>
      </div>
    </div>
  );
};
