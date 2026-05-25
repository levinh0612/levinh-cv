import React from 'react';
import { useCV } from '../../context/CVContext';

export const PersonalEditor: React.FC = () => {
  const { cvData, updatePersonal } = useCV();

  const handleInputChange = (field: string, value: string) => {
    updatePersonal(field, value);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        updatePersonal('avatarUrl', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <details className="dash-accordion">
      <summary className="dash-accordion-summary">
        <span className="dash-icon">👤</span>
        <span className="dash-title">Personal Info</span>
        <span className="dash-chevron">▼</span>
      </summary>
      <div className="dash-accordion-content">
        <div className="dash-field">
          <label className="dash-label">Full Name</label>
          <input
            type="text"
            value={cvData.personal.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className="dash-text-input"
          />
        </div>

        <div className="dash-field">
          <label className="dash-label">Job Title (EN)</label>
          <input
            type="text"
            value={cvData.personal.jobTitle}
            onChange={(e) => handleInputChange('jobTitle', e.target.value)}
            className="dash-text-input"
          />
        </div>

        <div className="dash-field">
          <label className="dash-label">Job Title (VI)</label>
          <input
            type="text"
            value={cvData.personal.jobTitleVi}
            onChange={(e) => handleInputChange('jobTitleVi', e.target.value)}
            className="dash-text-input"
          />
        </div>

        <div className="dash-field">
          <label className="dash-label">Date of Birth</label>
          <input
            type="text"
            value={cvData.personal.dob}
            onChange={(e) => handleInputChange('dob', e.target.value)}
            className="dash-text-input"
            placeholder="DD - MM - YYYY"
          />
        </div>

        <div className="dash-field">
          <label className="dash-label">Location</label>
          <input
            type="text"
            value={cvData.personal.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="dash-text-input"
          />
        </div>

        <div className="dash-field">
          <label className="dash-label">Phone</label>
          <input
            type="text"
            value={cvData.personal.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="dash-text-input"
          />
        </div>

        <div className="dash-field">
          <label className="dash-label">Email</label>
          <input
            type="email"
            value={cvData.personal.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="dash-text-input"
          />
        </div>

        <div className="dash-field">
          <label className="dash-label">LinkedIn URL</label>
          <input
            type="text"
            value={cvData.personal.linkedinUrl}
            onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
            className="dash-text-input"
          />
        </div>

        <div className="dash-field">
          <label className="dash-label">LinkedIn Display</label>
          <input
            type="text"
            value={cvData.personal.linkedinDisplay}
            onChange={(e) => handleInputChange('linkedinDisplay', e.target.value)}
            className="dash-text-input"
          />
        </div>

        <div className="dash-field">
          <label className="dash-label">Avatar Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="dash-file-input"
          />
          {cvData.personal.avatarUrl && (
            <div className="dash-avatar-preview">
              <img src={cvData.personal.avatarUrl} alt="Avatar" />
            </div>
          )}
        </div>
      </div>
    </details>
  );
};
