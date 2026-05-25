import React, { useState } from 'react';
import { useCV } from '../../context/CVContext';

export const ObjectiveEditor: React.FC = () => {
  const { cvData, updateObjective, updateObjectiveImpacts } = useCV();
  const [newImpactEn, setNewImpactEn] = useState('');
  const [newImpactVi, setNewImpactVi] = useState('');
  const [impactTab, setImpactTab] = useState<'en' | 'vi'>('en');

  const addImpact = (lang: 'en' | 'vi') => {
    const text = lang === 'en' ? newImpactEn : newImpactVi;
    if (text.trim()) {
      const currentImpacts = cvData.objective.impacts[lang] || [];
      updateObjectiveImpacts(lang, [...currentImpacts, text.trim()]);
      if (lang === 'en') setNewImpactEn('');
      else setNewImpactVi('');
    }
  };

  const removeImpact = (lang: 'en' | 'vi', index: number) => {
    const currentImpacts = cvData.objective.impacts[lang] || [];
    updateObjectiveImpacts(lang, currentImpacts.filter((_, i) => i !== index));
  };

  return (
    <details className="dash-accordion">
      <summary className="dash-accordion-summary">
        <span className="dash-icon">📝</span>
        <span className="dash-title">Objective</span>
        <span className="dash-chevron">▼</span>
      </summary>
      <div className="dash-accordion-content">
        <div className="dash-field">
          <label className="dash-label">Objective (EN) - {cvData.objective.en.length} chars</label>
          <textarea
            value={cvData.objective.en}
            onChange={(e) => updateObjective('en', e.target.value)}
            className="dash-textarea"
            rows={6}
          />
        </div>

        <div className="dash-field">
          <label className="dash-label">Objective (VI) - {cvData.objective.vi.length} chars</label>
          <textarea
            value={cvData.objective.vi}
            onChange={(e) => updateObjective('vi', e.target.value)}
            className="dash-textarea"
            rows={6}
          />
        </div>

        <div className="dash-field">
          <label className="dash-label">Impact Bullets</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button
              onClick={() => setImpactTab('en')}
              style={{
                padding: '6px 12px',
                background: impactTab === 'en' ? 'var(--primary)' : '#e5e7eb',
                color: impactTab === 'en' ? 'white' : 'var(--text)',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              EN
            </button>
            <button
              onClick={() => setImpactTab('vi')}
              style={{
                padding: '6px 12px',
                background: impactTab === 'vi' ? 'var(--primary)' : '#e5e7eb',
                color: impactTab === 'vi' ? 'white' : 'var(--text)',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              VI
            </button>
          </div>

          <div className="dash-chips">
            {(cvData.objective.impacts[impactTab] || []).map((impact, idx) => (
              <div key={idx} className="dash-chip">
                <span>{impact}</span>
                <button onClick={() => removeImpact(impactTab, idx)} className="dash-chip-remove">×</button>
              </div>
            ))}
          </div>

          <div className="dash-add-skill">
            {impactTab === 'en' ? (
              <>
                <input
                  type="text"
                  value={newImpactEn}
                  onChange={(e) => setNewImpactEn(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addImpact('en')}
                  className="dash-skill-input"
                  placeholder="Add impact bullet (EN)..."
                />
                <button onClick={() => addImpact('en')} className="dash-add-btn">+</button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={newImpactVi}
                  onChange={(e) => setNewImpactVi(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addImpact('vi')}
                  className="dash-skill-input"
                  placeholder="Add impact bullet (VI)..."
                />
                <button onClick={() => addImpact('vi')} className="dash-add-btn">+</button>
              </>
            )}
          </div>
        </div>
      </div>
    </details>
  );
};
