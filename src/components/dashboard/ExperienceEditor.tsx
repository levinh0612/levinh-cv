import React, { useState } from 'react';
import { useCV } from '../../context/CVContext';
import type { RoleBullets } from '../../types/cv';

export const ExperienceEditor: React.FC = () => {
  const { cvData, updateExperienceRole } = useCV();
  const [activeRoleTab, setActiveRoleTab] = useState<{ [key: number]: 'en' | 'vi' }>({});

  const handleRoleChange = (expIdx: number, roleIdx: number, field: string, value: string | string[]) => {
    updateExperienceRole(expIdx, roleIdx, field, value);
  };

  const handleBulletChange = (expIdx: number, roleIdx: number, lang: 'en' | 'vi', bulletIdx: number, value: string) => {
    const role = cvData.experience[expIdx].roles[roleIdx];
    const bullets: RoleBullets = { ...role.bullets };
    bullets[lang] = [...bullets[lang]];
    bullets[lang][bulletIdx] = value;
    updateExperienceRole(expIdx, roleIdx, 'bullets', bullets);
  };

  const addBullet = (expIdx: number, roleIdx: number, lang: 'en' | 'vi') => {
    const role = cvData.experience[expIdx].roles[roleIdx];
    const bullets: RoleBullets = { ...role.bullets };
    bullets[lang] = [...bullets[lang], ''];
    updateExperienceRole(expIdx, roleIdx, 'bullets', bullets);
  };

  const removeBullet = (expIdx: number, roleIdx: number, lang: 'en' | 'vi', bulletIdx: number) => {
    const role = cvData.experience[expIdx].roles[roleIdx];
    const bullets: RoleBullets = { ...role.bullets };
    bullets[lang] = bullets[lang].filter((_, i) => i !== bulletIdx);
    updateExperienceRole(expIdx, roleIdx, 'bullets', bullets);
  };

  return (
    <details className="dash-accordion">
      <summary className="dash-accordion-summary">
        <span className="dash-icon">🏢</span>
        <span className="dash-title">Experience</span>
        <span className="dash-chevron">▼</span>
      </summary>
      <div className="dash-accordion-content">
        {cvData.experience.map((exp, expIdx) => (
          <div key={expIdx} className="dash-experience-item">
            <div className="dash-section-divider">{exp.company}</div>
            {exp.roles.map((role, roleIdx) => (
              <div key={roleIdx} className="dash-role-item">
                <div className="dash-role-header">Role {roleIdx + 1}</div>

                <div className="dash-field">
                  <label className="dash-label">Title (EN)</label>
                  <input
                    type="text"
                    value={role.titleEn}
                    onChange={(e) => handleRoleChange(expIdx, roleIdx, 'titleEn', e.target.value)}
                    className="dash-text-input"
                  />
                </div>

                <div className="dash-field">
                  <label className="dash-label">Title (VI)</label>
                  <input
                    type="text"
                    value={role.titleVi}
                    onChange={(e) => handleRoleChange(expIdx, roleIdx, 'titleVi', e.target.value)}
                    className="dash-text-input"
                  />
                </div>

                <div className="dash-field">
                  <label className="dash-label">Period</label>
                  <input
                    type="text"
                    value={role.period}
                    onChange={(e) => handleRoleChange(expIdx, roleIdx, 'period', e.target.value)}
                    className="dash-text-input"
                  />
                </div>

                <div className="dash-field">
                  <label className="dash-label">Skills</label>
                  <input
                    type="text"
                    value={role.skills}
                    onChange={(e) => handleRoleChange(expIdx, roleIdx, 'skills', e.target.value)}
                    className="dash-text-input"
                  />
                </div>

                <div className="dash-field">
                  <div className="dash-lang-tabs">
                    <button
                      onClick={() => setActiveRoleTab({ ...activeRoleTab, [roleIdx]: 'en' })}
                      className={`dash-tab ${(activeRoleTab[roleIdx] || 'en') === 'en' ? 'active' : ''}`}
                    >
                      EN Bullets
                    </button>
                    <button
                      onClick={() => setActiveRoleTab({ ...activeRoleTab, [roleIdx]: 'vi' })}
                      className={`dash-tab ${(activeRoleTab[roleIdx] || 'en') === 'vi' ? 'active' : ''}`}
                    >
                      VI Bullets
                    </button>
                  </div>

                  {(activeRoleTab[roleIdx] || 'en') === 'en' && (
                    <div className="dash-bullets-list">
                      {role.bullets.en.map((bullet, bulletIdx) => (
                        <div key={bulletIdx} className="dash-bullet-item">
                          <input
                            type="text"
                            value={bullet}
                            onChange={(e) => handleBulletChange(expIdx, roleIdx, 'en', bulletIdx, e.target.value)}
                            className="dash-bullet-input"
                          />
                          <button onClick={() => removeBullet(expIdx, roleIdx, 'en', bulletIdx)} className="dash-remove-btn">×</button>
                        </div>
                      ))}
                      <button onClick={() => addBullet(expIdx, roleIdx, 'en')} className="dash-add-bullet-btn">+ Add Bullet</button>
                    </div>
                  )}

                  {(activeRoleTab[roleIdx] || 'en') === 'vi' && (
                    <div className="dash-bullets-list">
                      {role.bullets.vi.map((bullet, bulletIdx) => (
                        <div key={bulletIdx} className="dash-bullet-item">
                          <input
                            type="text"
                            value={bullet}
                            onChange={(e) => handleBulletChange(expIdx, roleIdx, 'vi', bulletIdx, e.target.value)}
                            className="dash-bullet-input"
                          />
                          <button onClick={() => removeBullet(expIdx, roleIdx, 'vi', bulletIdx)} className="dash-remove-btn">×</button>
                        </div>
                      ))}
                      <button onClick={() => addBullet(expIdx, roleIdx, 'vi')} className="dash-add-bullet-btn">+ Add Bullet</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </details>
  );
};
