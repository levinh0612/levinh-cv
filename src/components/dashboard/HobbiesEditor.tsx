import React, { useState } from 'react';
import { useCV } from '../../context/CVContext';
import type { Hobby } from '../../types/cv';

export const HobbiesEditor: React.FC = () => {
  const { cvData, updateHobbies } = useCV();
  const [newIcon, setNewIcon] = useState('');
  const [newLabelEn, setNewLabelEn] = useState('');
  const [newLabelVi, setNewLabelVi] = useState('');

  const addHobby = () => {
    if (newIcon.trim() && newLabelEn.trim() && newLabelVi.trim()) {
      const newHobby: Hobby = {
        icon: newIcon.trim(),
        label: newLabelEn.trim(),
        labelVi: newLabelVi.trim(),
      };
      updateHobbies([...cvData.hobbies, newHobby]);
      setNewIcon('');
      setNewLabelEn('');
      setNewLabelVi('');
    }
  };

  const removeHobby = (index: number) => {
    updateHobbies(cvData.hobbies.filter((_, i) => i !== index));
  };

  return (
    <details className="dash-accordion">
      <summary className="dash-accordion-summary">
        <span className="dash-icon">🎯</span>
        <span className="dash-title">Hobbies</span>
        <span className="dash-chevron">▼</span>
      </summary>
      <div className="dash-accordion-content">
        <div className="dash-field">
          <label className="dash-label">Your Hobbies</label>
          <div className="dash-chips">
            {cvData.hobbies.map((hobby, idx) => (
              <div key={idx} className="dash-chip">
                <span>{hobby.icon} {hobby.label} / {hobby.labelVi}</span>
                <button onClick={() => removeHobby(idx)} className="dash-chip-remove">×</button>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <div className="dash-add-skill">
              <input
                type="text"
                value={newIcon}
                onChange={(e) => setNewIcon(e.target.value)}
                className="dash-skill-input"
                placeholder="Icon emoji..."
                style={{ maxWidth: 100 }}
              />
              <input
                type="text"
                value={newLabelEn}
                onChange={(e) => setNewLabelEn(e.target.value)}
                className="dash-skill-input"
                placeholder="Label (EN)..."
              />
              <input
                type="text"
                value={newLabelVi}
                onChange={(e) => setNewLabelVi(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addHobby()}
                className="dash-skill-input"
                placeholder="Label (VI)..."
              />
              <button onClick={addHobby} className="dash-add-btn">+</button>
            </div>
          </div>
        </div>
      </div>
    </details>
  );
};
