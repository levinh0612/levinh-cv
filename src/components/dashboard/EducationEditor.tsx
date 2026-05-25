import React from 'react';
import { useCV } from '../../context/CVContext';

export const EducationEditor: React.FC = () => {
  const { cvData, updateEducation } = useCV();
  const edu = cvData.education;

  const handleChange = (field: string, value: string) => {
    updateEducation(field, value);
  };

  return (
    <details className="dash-accordion">
      <summary className="dash-accordion-summary">
        <span className="dash-icon">🎓</span>
        <span className="dash-title">Education</span>
        <span className="dash-chevron">▼</span>
      </summary>
      <div className="dash-accordion-content">
        <div className="dash-field">
          <label className="dash-label">School</label>
          <input
            type="text"
            value={edu.school}
            onChange={(e) => handleChange('school', e.target.value)}
            className="dash-text-input"
          />
        </div>

        <div className="dash-field">
          <label className="dash-label">Major</label>
          <input
            type="text"
            value={edu.major}
            onChange={(e) => handleChange('major', e.target.value)}
            className="dash-text-input"
          />
        </div>

        <div className="dash-field">
          <label className="dash-label">Subject</label>
          <input
            type="text"
            value={edu.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            className="dash-text-input"
          />
        </div>

        <div className="dash-field">
          <label className="dash-label">GPA</label>
          <input
            type="text"
            value={edu.gpa}
            onChange={(e) => handleChange('gpa', e.target.value)}
            className="dash-text-input"
          />
        </div>

        <div className="dash-field">
          <label className="dash-label">Period</label>
          <input
            type="text"
            value={edu.period}
            onChange={(e) => handleChange('period', e.target.value)}
            className="dash-text-input"
          />
        </div>
      </div>
    </details>
  );
};
