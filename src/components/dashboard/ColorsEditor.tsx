import React from 'react';
import { useCV } from '../../context/CVContext';

const THEMES = [
  { name: 'Navy & Gold', primary: '#1a2b4a', accent: '#c8963e' },
  { name: 'Forest & Amber', primary: '#1a3a2a', accent: '#d4a017' },
  { name: 'Slate & Coral', primary: '#334155', accent: '#f97316' },
  { name: 'Indigo & Teal', primary: '#312e81', accent: '#0d9488' },
  { name: 'Charcoal & Rose', primary: '#1c1c1e', accent: '#e11d48' },
];

export const ColorsEditor: React.FC = () => {
  const { cvConfig, updateConfig } = useCV();

  const handlePrimaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateConfig({ ...cvConfig, colors: { ...cvConfig.colors, primary: e.target.value } });
  };

  const handleAccentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateConfig({ ...cvConfig, colors: { ...cvConfig.colors, accent: e.target.value } });
  };

  const applyTheme = (theme: typeof THEMES[0]) => {
    updateConfig({ ...cvConfig, colors: { primary: theme.primary, accent: theme.accent } });
  };

  return (
    <details className="dash-accordion" open>
      <summary className="dash-accordion-summary">
        <span className="dash-icon">🎨</span>
        <span className="dash-title">Colors</span>
        <span className="dash-chevron">▼</span>
      </summary>
      <div className="dash-accordion-content">
        <div className="dash-field">
          <label className="dash-label">Primary Color</label>
          <div className="dash-input-row">
            <input
              type="color"
              value={cvConfig.colors.primary}
              onChange={handlePrimaryChange}
              className="dash-color-input"
            />
            <input
              type="text"
              value={cvConfig.colors.primary}
              onChange={handlePrimaryChange}
              className="dash-text-input"
              placeholder="#000000"
            />
          </div>
        </div>

        <div className="dash-field">
          <label className="dash-label">Accent Color</label>
          <div className="dash-input-row">
            <input
              type="color"
              value={cvConfig.colors.accent}
              onChange={handleAccentChange}
              className="dash-color-input"
            />
            <input
              type="text"
              value={cvConfig.colors.accent}
              onChange={handleAccentChange}
              className="dash-text-input"
              placeholder="#000000"
            />
          </div>
        </div>

        <div className="dash-field">
          <label className="dash-label">Presets</label>
          <div className="dash-presets">
            {THEMES.map(theme => (
              <button
                key={theme.name}
                onClick={() => applyTheme(theme)}
                className="dash-preset-btn"
                title={theme.name}
              >
                <div className="dash-preset-colors">
                  <div style={{ background: theme.primary }} className="dash-preset-color"></div>
                  <div style={{ background: theme.accent }} className="dash-preset-color"></div>
                </div>
                <span className="dash-preset-name">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </details>
  );
};
