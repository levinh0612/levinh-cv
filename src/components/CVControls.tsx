import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, Download, Settings, Rocket } from 'lucide-react';
import { useCV } from '../context/CVContext';
import { usePrintPDF } from '../hooks/usePrintPDF';

const IS_LOCAL = import.meta.env.DEV;

export const CVControls: React.FC = () => {
  const navigate = useNavigate();
  const { lang, toggleLang, isDark, toggleDark } = useCV();
  const { downloadPDF } = usePrintPDF();

  return (
    <>
      <div id="cv-controls" style={{ position: 'fixed', top: 16, right: 20, display: 'flex', gap: 8, zIndex: 200 }}>
        <button onClick={toggleLang} className="ctrl-btn" title="Toggle language">
          <span>{lang === 'en' ? '🇻🇳 VI' : '🇬🇧 EN'}</span>
        </button>
        <button onClick={toggleDark} className="ctrl-btn" title="Toggle dark mode">
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        {IS_LOCAL && (
          <>
            <button onClick={() => navigate('/dashboard')} className="ctrl-btn" title="Dashboard">
              <Settings size={14} />
              <span>Dashboard</span>
            </button>
            <button onClick={() => navigate('/deploy')} className="ctrl-btn" title="Deploy">
              <Rocket size={14} />
              <span>Deploy</span>
            </button>
          </>
        )}
      </div>

      <button
        id="download-btn"
        onClick={() => downloadPDF(lang, isDark)}
        style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 100 }}
        title={lang === 'en' ? 'Download PDF' : 'Tải CV PDF'}
      >
        <Download size={14} />
        <span>{lang === 'en' ? 'Download PDF' : 'Tải CV PDF'}</span>
      </button>
    </>
  );
};
