import React from 'react';
import { useCV } from '../../context/CVContext';

export const AchievementsEditor: React.FC = () => {
  const { cvData, updateAchievement } = useCV();

  const handleChange = (index: number, field: string, value: string) => {
    updateAchievement(index, field, value);
  };

  const handleProofChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        updateAchievement(index, 'proofUrl', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <details className="dash-accordion">
      <summary className="dash-accordion-summary">
        <span className="dash-icon">🏆</span>
        <span className="dash-title">Achievements</span>
        <span className="dash-chevron">▼</span>
      </summary>
      <div className="dash-accordion-content">
        {cvData.achievements.map((ach, idx) => (
          <div key={idx} className="dash-achievement-item">
            <div className="dash-achievement-header">Achievement {idx + 1}</div>

            <div className="dash-field">
              <label className="dash-label">Year</label>
              <input
                type="text"
                value={ach.year}
                onChange={(e) => handleChange(idx, 'year', e.target.value)}
                className="dash-text-input"
              />
            </div>

            <div className="dash-field">
              <label className="dash-label">Title (EN)</label>
              <input
                type="text"
                value={ach.titleEn}
                onChange={(e) => handleChange(idx, 'titleEn', e.target.value)}
                className="dash-text-input"
              />
            </div>

            <div className="dash-field">
              <label className="dash-label">Title (VI)</label>
              <input
                type="text"
                value={ach.titleVi}
                onChange={(e) => handleChange(idx, 'titleVi', e.target.value)}
                className="dash-text-input"
              />
            </div>

            <div className="dash-field">
              <label className="dash-label">Organization</label>
              <input
                type="text"
                value={ach.org}
                onChange={(e) => handleChange(idx, 'org', e.target.value)}
                className="dash-text-input"
              />
            </div>

            <div className="dash-field">
              <label className="dash-label">Proof Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleProofChange(idx, e)}
                className="dash-file-input"
              />
              {ach.proofUrl && (
                <div className="dash-proof-preview">
                  <img src={ach.proofUrl} alt="Proof" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </details>
  );
};
