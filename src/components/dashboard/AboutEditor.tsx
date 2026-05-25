import React from 'react';
import { useCV } from '../../context/CVContext';

export const AboutEditor: React.FC = () => {
  const { cvData, updateAbout } = useCV();

  return (
    <details className="dash-accordion">
      <summary className="dash-accordion-summary">
        <span className="dash-icon">🤝</span>
        <span className="dash-title">About</span>
        <span className="dash-chevron">▼</span>
      </summary>
      <div className="dash-accordion-content">
        <div className="dash-field">
          <label className="dash-label">About (EN) - {cvData.about.en.length} chars</label>
          <textarea
            value={cvData.about.en}
            onChange={(e) => updateAbout('en', e.target.value)}
            className="dash-textarea"
            rows={6}
          />
        </div>

        <div className="dash-field">
          <label className="dash-label">About (VI) - {cvData.about.vi.length} chars</label>
          <textarea
            value={cvData.about.vi}
            onChange={(e) => updateAbout('vi', e.target.value)}
            className="dash-textarea"
            rows={6}
          />
        </div>
      </div>
    </details>
  );
};
