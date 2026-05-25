import React from 'react';
import { useCV } from '../../context/CVContext';
import { useInView } from '../../hooks/useInView';
import type { SkillsSection as SkillsSectionType } from '../../types/cv';

interface SkillsSectionProps {
  skills: SkillsSectionType;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const { lang } = useCV();
  const { ref, inView } = useInView();

  const skillCards = [
    { labelEn: 'Frontend',          labelVi: 'Frontend',            items: skills.frontend },
    { labelEn: 'Backend',           labelVi: 'Backend',             items: skills.backend },
    { labelEn: 'Database',          labelVi: 'Cơ Sở Dữ Liệu',      items: skills.database },
    { labelEn: 'Platform & DevOps', labelVi: 'Nền Tảng & DevOps',  items: [...skills.platform, ...skills.devops] },
  ];

  const aiItems = skills.ai ?? [];

  const softItems = lang === 'en' ? skills.soft : (skills.softVi ?? skills.soft);

  return (
    <div ref={ref} className={`mb-8 reveal${inView ? ' is-visible' : ''}`}>
      <div className="section-heading-block">
        <span>{lang === 'en' ? 'SKILLS' : 'KỸ NĂNG'}</span>
      </div>

      <div className="skills-card-grid">
        {skillCards.map((card) => (
          <div key={card.labelEn} className="skill-card">
            <div className="skill-card-label">
              {lang === 'en' ? card.labelEn : card.labelVi}
            </div>
            <div className="tag-list">
              {card.items.map((item, idx) => (
                <span key={idx} className="skill-chip">{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {aiItems.length > 0 && (
        <div className="skills-ai-section">
          <div className="skill-card-label skill-card-label--ai">
            {lang === 'en' ? 'AI Agents & Tools' : 'AI Agents & Công Cụ AI'}
          </div>
          <div className="tag-list">
            {aiItems.map((item, idx) => (
              <span key={idx} className="skill-chip skill-chip--ai">{item}</span>
            ))}
          </div>
        </div>
      )}

      <div className="skills-soft-section">
        <div className="skill-card-label skill-card-label--soft">
          {lang === 'en' ? 'Soft Skills' : 'Kỹ Năng Mềm'}
        </div>
        <div className="soft-grid">
          {softItems.map((skill, idx) => (
            <div key={idx} className="soft-grid-item">
              <span className="soft-dot" />
              <span>{skill}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
