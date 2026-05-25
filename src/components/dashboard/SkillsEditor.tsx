import React, { useState } from 'react';
import { useCV } from '../../context/CVContext';
import type { SkillsSection } from '../../types/cv';

const SKILL_CATEGORIES: { key: keyof SkillsSection; label: string; icon: string }[] = [
  { key: 'frontend', label: 'Frontend', icon: '🎨' },
  { key: 'backend', label: 'Backend', icon: '⚙️' },
  { key: 'platform', label: 'Platform', icon: '💻' },
  { key: 'database', label: 'Database', icon: '🗄️' },
  { key: 'devops', label: 'DevOps', icon: '🚀' },
  { key: 'soft', label: 'Soft Skills', icon: '🤝' },
];

export const SkillsEditor: React.FC = () => {
  const { cvData, updateSkillList } = useCV();
  const [newSkill, setNewSkill] = useState<{ [key in keyof SkillsSection]: string }>({
    frontend: '',
    backend: '',
    platform: '',
    database: '',
    devops: '',
    ai: '',
    soft: '',
    softVi: '',
  });

  const addSkill = (category: keyof SkillsSection) => {
    const val = (newSkill[category] ?? '').trim();
    if (val) {
      updateSkillList(category, [...(cvData.skills[category] ?? []), val]);
      setNewSkill({ ...newSkill, [category]: '' });
    }
  };

  const removeSkill = (category: keyof SkillsSection, index: number) => {
    updateSkillList(category, (cvData.skills[category] ?? []).filter((_, i) => i !== index));
  };

  return (
    <details className="dash-accordion">
      <summary className="dash-accordion-summary">
        <span className="dash-icon">💼</span>
        <span className="dash-title">Skills</span>
        <span className="dash-chevron">▼</span>
      </summary>
      <div className="dash-accordion-content">
        {SKILL_CATEGORIES.map(({ key, label, icon }) => (
          <div key={key} className="dash-field">
            <label className="dash-label">{icon} {label}</label>
            <div className="dash-chips">
              {(cvData.skills[key] ?? []).map((skill, idx) => (
                <div key={idx} className="dash-chip">
                  <span>{skill}</span>
                  <button onClick={() => removeSkill(key, idx)} className="dash-chip-remove">×</button>
                </div>
              ))}
            </div>
            <div className="dash-add-skill">
              <input
                type="text"
                value={newSkill[key]}
                onChange={(e) => setNewSkill({ ...newSkill, [key]: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && addSkill(key)}
                className="dash-skill-input"
                placeholder="Add skill..."
              />
              <button onClick={() => addSkill(key)} className="dash-add-btn">+</button>
            </div>
          </div>
        ))}
      </div>
    </details>
  );
};
