import React from 'react';
import { useCV } from '../../context/CVContext';

const HEADING_FONTS = ['Playfair Display', 'DM Serif Display', 'Lora', 'Merriweather', 'EB Garamond'];
const BODY_FONTS = ['Inter', 'Nunito', 'Mulish', 'Lato', 'Raleway'];

export const TypographyEditor: React.FC = () => {
  const { cvConfig, updateConfig } = useCV();

  const handleHeadingFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateConfig({ ...cvConfig, typography: { ...cvConfig.typography, headingFont: e.target.value } });
  };

  const handleBodyFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateConfig({ ...cvConfig, typography: { ...cvConfig.typography, bodyFont: e.target.value } });
  };

  const handleBaseFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateConfig({ ...cvConfig, typography: { ...cvConfig.typography, baseFontSize: parseFloat(e.target.value) } });
  };

  return (
    <details className="dash-accordion">
      <summary className="dash-accordion-summary">
        <span className="dash-icon">✍️</span>
        <span className="dash-title">Typography</span>
        <span className="dash-chevron">▼</span>
      </summary>
      <div className="dash-accordion-content">
        <div className="dash-field">
          <label className="dash-label">Heading Font</label>
          <select value={cvConfig.typography.headingFont} onChange={handleHeadingFontChange} className="dash-select">
            {HEADING_FONTS.map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </div>

        <div className="dash-field">
          <label className="dash-label">Body Font</label>
          <select value={cvConfig.typography.bodyFont} onChange={handleBodyFontChange} className="dash-select">
            {BODY_FONTS.map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </div>

        <div className="dash-field">
          <label className="dash-label">Base Font Size: {cvConfig.typography.baseFontSize}px</label>
          <input
            type="range"
            min="12"
            max="16"
            step="0.5"
            value={cvConfig.typography.baseFontSize}
            onChange={handleBaseFontSizeChange}
            className="dash-slider"
          />
        </div>

        <div className="dash-preview-box">
          <p style={{
            fontFamily: `'${cvConfig.typography.headingFont}', serif`,
            fontSize: '1.8rem',
            marginBottom: '8px'
          }}>
            Heading Preview
          </p>
          <p style={{
            fontFamily: `'${cvConfig.typography.bodyFont}', sans-serif`,
            fontSize: `${cvConfig.typography.baseFontSize}px`
          }}>
            Body text preview with selected font
          </p>
        </div>
      </div>
    </details>
  );
};
