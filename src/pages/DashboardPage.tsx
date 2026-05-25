import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCV } from '../context/CVContext';
import { CVCard } from '../components/CVCard';
import { ColorsEditor } from '../components/dashboard/ColorsEditor';
import { TypographyEditor } from '../components/dashboard/TypographyEditor';
import { PersonalEditor } from '../components/dashboard/PersonalEditor';
import { AboutEditor } from '../components/dashboard/AboutEditor';
import { ObjectiveEditor } from '../components/dashboard/ObjectiveEditor';
import { EducationEditor } from '../components/dashboard/EducationEditor';
import { SkillsEditor } from '../components/dashboard/SkillsEditor';
import { AchievementsEditor } from '../components/dashboard/AchievementsEditor';
import { ExperienceEditor } from '../components/dashboard/ExperienceEditor';
import { HobbiesEditor } from '../components/dashboard/HobbiesEditor';
import { ChevronLeft, RotateCcw, RefreshCw, Download, Upload, Rocket } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { undo, canUndo, exportJSON, importJSON, resetToDefaults } = useCV();

  const panelRef = useRef<HTMLDivElement>(null);
  const cvCardRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.6);
  const [cvHeight, setCvHeight] = useState(0);

  const updateScale = useCallback(() => {
    if (panelRef.current) {
      const panelWidth = panelRef.current.offsetWidth - 48;
      setScale(Math.min(Math.max(panelWidth / 800, 0.4), 0.85));
    }
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [updateScale]);

  useEffect(() => {
    if (!cvCardRef.current) return;
    const ro = new ResizeObserver(entries => {
      setCvHeight(entries[0].contentRect.height);
    });
    ro.observe(cvCardRef.current);
    return () => ro.disconnect();
  }, []);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) importJSON(file);
    e.target.value = '';
  };

  return (
    <div className="dash-container">
      <div className="dash-header">
        <button onClick={() => navigate('/')} className="dash-header-btn dash-back-btn">
          <ChevronLeft size={16} />
          <span>View CV</span>
        </button>
        <h1 className="dash-title-text">Dashboard</h1>
        <button onClick={() => navigate('/deploy')} className="dash-header-btn" title="Vercel Deployments" style={{ marginLeft: 8 }}>
          <Rocket size={14} />
          Deploy
        </button>
        <div className="dash-header-actions">
          <button onClick={undo} disabled={!canUndo} className="dash-header-btn" title="Undo last change">
            <RotateCcw size={14} />
            Undo
          </button>
          <button onClick={resetToDefaults} className="dash-header-btn" title="Reset to original data">
            <RefreshCw size={14} />
            Reset
          </button>
          <button onClick={exportJSON} className="dash-header-btn" title="Export as JSON">
            <Download size={14} />
            Export
          </button>
          <label className="dash-header-btn" title="Import JSON">
            <Upload size={14} />
            Import
            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      <div className="dash-content">
        <div className="dash-sidebar">
          <div className="dash-accordion-list">
            <ColorsEditor />
            <TypographyEditor />
            <PersonalEditor />
            <AboutEditor />
            <ObjectiveEditor />
            <EducationEditor />
            <SkillsEditor />
            <AchievementsEditor />
            <ExperienceEditor />
            <HobbiesEditor />
          </div>
        </div>

        <div className="dash-preview" ref={panelRef}>
          <div style={{
            width: `${800 * scale}px`,
            height: cvHeight ? `${cvHeight * scale}px` : 'auto',
            overflow: 'hidden',
            margin: '24px auto',
            flexShrink: 0,
            boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
          }}>
            <div
              ref={cvCardRef}
              style={{
                width: 800,
                transformOrigin: 'top left',
                transform: `scale(${scale})`,
              }}
            >
              <CVCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
