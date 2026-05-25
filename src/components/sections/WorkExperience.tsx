import React from 'react';
import { useCV } from '../../context/CVContext';
import { useInView } from '../../hooks/useInView';
import type { Experience } from '../../types/cv';

interface WorkExperienceSectionProps {
  experience: Experience[];
}

export const WorkExperienceSection: React.FC<WorkExperienceSectionProps> = ({ experience }) => {
  const { lang } = useCV();
  const { ref, inView } = useInView(0.05);

  return (
    <div ref={ref} className={`mb-8 reveal${inView ? ' is-visible' : ''}`}>
      <div className="section-heading-block">
        <span>{lang === 'en' ? 'WORK EXPERIENCE' : 'KINH NGHIỆM LÀM VIỆC'}</span>
      </div>

      {experience.map((exp, expIdx) => (
        <div key={expIdx} className="company-block">

          <div className="company-header">
            <span className="company-name">{exp.company}</span>
            <span className="company-period">{exp.period}</span>
          </div>

          <div className="company-location">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {exp.location}
          </div>

          <div className="roles-list">
            {exp.roles.map((role, roleIdx) => {
              const title = lang === 'en' ? role.titleEn : role.titleVi;
              const bullets = lang === 'en' ? role.bullets.en : role.bullets.vi;
              const stackChips = role.skills.split(/,\s*|\s*\/\s*|\s*\+\s*/).map(s => s.trim()).filter(Boolean);

              return (
                <div key={roleIdx} className="role-card">
                  <div className="role-top">
                    <span className="role-title">{title}</span>
                    <span className="role-period">{role.period}</span>
                  </div>
                  <div className="role-skills-line">
                    <span className="skill-pfx">{lang === 'en' ? 'STACK' : 'CÔNG NGHỆ'}</span>
                    <div className="stack-chips">
                      {stackChips.map((chip, i) => (
                        <span key={i} className="stack-chip">{chip}</span>
                      ))}
                    </div>
                  </div>
                  <ul className="role-bullets">
                    {bullets.map((bullet, idx) => (
                      <li key={idx} className="role-bullet">
                        <span className="bullet-arrow">›</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
