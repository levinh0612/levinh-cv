import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { CVData, CVConfig, CVAppState, RoleBullets, SkillsSection, Hobby } from '../types/cv';
import cvJsonData from '../data/cv.json';

const DEFAULT_CONFIG: CVConfig = {
  colors: { primary: '#1a2b4a', accent: '#c8963e' },
  typography: { headingFont: 'Playfair Display', bodyFont: 'Inter', baseFontSize: 14 }
};

interface CVContextType {
  lang: 'en' | 'vi';
  toggleLang: () => void;
  isDark: boolean;
  toggleDark: () => void;
  cvData: CVData;
  cvConfig: CVConfig;
  updatePersonal: (field: string, value: string) => void;
  updateAbout: (lang: 'en' | 'vi', value: string) => void;
  updateObjective: (lang: 'en' | 'vi', value: string) => void;
  updateObjectiveImpacts: (lang: 'en' | 'vi', impacts: string[]) => void;
  updateEducation: (field: string, value: string) => void;
  updateSkillList: (category: keyof SkillsSection, skills: string[]) => void;
  updateAchievement: (index: number, field: string, value: string) => void;
  updateExperienceRole: (expIdx: number, roleIdx: number, field: string, value: string | string[] | RoleBullets) => void;
  updateHobbies: (hobbies: Hobby[]) => void;
  updateConfig: (config: CVConfig) => void;
  exportJSON: () => void;
  importJSON: (file: File) => void;
  resetToDefaults: () => void;
  undo: () => void;
  canUndo: boolean;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

const injectFont = (fontName: string) => {
  const id = `gf-${fontName.replace(/\s/g, '-').toLowerCase()}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@300;400;500;600;700&display=swap`;
  document.head.appendChild(link);
};

const applyCSSVariables = (config: CVConfig) => {
  const root = document.documentElement;
  root.style.setProperty('--primary', config.colors.primary);
  root.style.setProperty('--accent', config.colors.accent);
  root.style.setProperty('--heading-font', `'${config.typography.headingFont}', serif`);
  root.style.setProperty('--body-font', `'${config.typography.bodyFont}', sans-serif`);
  root.style.setProperty('--base-font-size', `${config.typography.baseFontSize}px`);
};

export const CVProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<'en' | 'vi'>('en');
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('cv-dark-mode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [cvData, setCvData] = useState<CVData>(() => {
    const saved = localStorage.getItem('cv-app-state');
    if (saved) {
      try {
        const state: CVAppState = JSON.parse(saved);
        const d = state.data;
        // Reset if data structure is outdated
        if (!d.about || !d.objective?.impacts || (d.hobbies?.length > 0 && typeof d.hobbies[0] === 'string')) {
          return cvJsonData as CVData;
        }
        return d;
      } catch {
        return cvJsonData as CVData;
      }
    }
    return cvJsonData as CVData;
  });

  const [cvConfig, setCvConfig] = useState<CVConfig>(() => {
    const saved = localStorage.getItem('cv-app-state');
    if (saved) {
      try {
        const state: CVAppState = JSON.parse(saved);
        return state.config;
      } catch {
        return DEFAULT_CONFIG;
      }
    }
    return DEFAULT_CONFIG;
  });

  const [history, setHistory] = useState<CVAppState[]>([]);
  const canUndo = history.length > 0;

  const saveToLocalStorage = useCallback((data: CVData, config: CVConfig) => {
    const state: CVAppState = { data, config };
    localStorage.setItem('cv-app-state', JSON.stringify(state));
  }, []);

  const pushHistory = useCallback((data: CVData, config: CVConfig) => {
    setHistory(prev => [...prev.slice(-19), { data: JSON.parse(JSON.stringify(data)), config: JSON.parse(JSON.stringify(config)) }]);
  }, []);

  const toggleLang = () => {
    setLang((prev: 'en' | 'vi') => prev === 'en' ? 'vi' : 'en');
  };

  const toggleDark = () => {
    setIsDark((prev: boolean) => !prev);
  };

  const updatePersonal = useCallback((field: string, value: string) => {
    setCvData(prev => {
      const updated = { ...prev, personal: { ...prev.personal, [field]: value } };
      pushHistory(updated, cvConfig);
      saveToLocalStorage(updated, cvConfig);
      return updated;
    });
  }, [cvConfig, pushHistory, saveToLocalStorage]);

  const updateAbout = useCallback((aboutLang: 'en' | 'vi', value: string) => {
    setCvData(prev => {
      const updated = { ...prev, about: { ...prev.about, [aboutLang]: value } };
      pushHistory(updated, cvConfig);
      saveToLocalStorage(updated, cvConfig);
      return updated;
    });
  }, [cvConfig, pushHistory, saveToLocalStorage]);

  const updateObjective = useCallback((objLang: 'en' | 'vi', value: string) => {
    setCvData(prev => {
      const updated = { ...prev, objective: { ...prev.objective, [objLang]: value } };
      pushHistory(updated, cvConfig);
      saveToLocalStorage(updated, cvConfig);
      return updated;
    });
  }, [cvConfig, pushHistory, saveToLocalStorage]);

  const updateObjectiveImpacts = useCallback((impactLang: 'en' | 'vi', impacts: string[]) => {
    setCvData(prev => {
      const updated = { ...prev, objective: { ...prev.objective, impacts: { ...prev.objective.impacts, [impactLang]: impacts } } };
      pushHistory(updated, cvConfig);
      saveToLocalStorage(updated, cvConfig);
      return updated;
    });
  }, [cvConfig, pushHistory, saveToLocalStorage]);

  const updateEducation = useCallback((field: string, value: string) => {
    setCvData(prev => {
      const updated = { ...prev, education: { ...prev.education, [field]: value } };
      pushHistory(updated, cvConfig);
      saveToLocalStorage(updated, cvConfig);
      return updated;
    });
  }, [cvConfig, pushHistory, saveToLocalStorage]);

  const updateSkillList = useCallback((category: keyof SkillsSection, skills: string[]) => {
    setCvData(prev => {
      const updated = { ...prev, skills: { ...prev.skills, [category]: skills } };
      pushHistory(updated, cvConfig);
      saveToLocalStorage(updated, cvConfig);
      return updated;
    });
  }, [cvConfig, pushHistory, saveToLocalStorage]);

  const updateAchievement = useCallback((index: number, field: string, value: string) => {
    setCvData(prev => {
      const updated = { ...prev, achievements: prev.achievements.map((a, i) => i === index ? { ...a, [field]: value } : a) };
      pushHistory(updated, cvConfig);
      saveToLocalStorage(updated, cvConfig);
      return updated;
    });
  }, [cvConfig, pushHistory, saveToLocalStorage]);

  const updateExperienceRole = useCallback((expIdx: number, roleIdx: number, field: string, value: string | string[] | RoleBullets) => {
    setCvData(prev => {
      const updated = { ...prev, experience: prev.experience.map((e, ei) => ei === expIdx ? { ...e, roles: e.roles.map((r, ri) => ri === roleIdx ? { ...r, [field]: value } : r) } : e) };
      pushHistory(updated, cvConfig);
      saveToLocalStorage(updated, cvConfig);
      return updated;
    });
  }, [cvConfig, pushHistory, saveToLocalStorage]);

  const updateHobbies = useCallback((hobbies: Hobby[]) => {
    setCvData(prev => {
      const updated = { ...prev, hobbies };
      pushHistory(updated, cvConfig);
      saveToLocalStorage(updated, cvConfig);
      return updated;
    });
  }, [cvConfig, pushHistory, saveToLocalStorage]);

  const updateConfig = useCallback((config: CVConfig) => {
    setCvConfig(config);
    pushHistory(cvData, config);
    saveToLocalStorage(cvData, config);
  }, [cvData, pushHistory, saveToLocalStorage]);

  const exportJSON = useCallback(() => {
    const state: CVAppState = { data: cvData, config: cvConfig };
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cv-config.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [cvData, cvConfig]);

  const importJSON = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const state: CVAppState = JSON.parse(e.target?.result as string);
        if (state.data && state.config) {
          pushHistory(cvData, cvConfig);
          setCvData(state.data);
          setCvConfig(state.config);
          saveToLocalStorage(state.data, state.config);
        }
      } catch (err) {
        console.error('Failed to import JSON:', err);
      }
    };
    reader.readAsText(file);
  }, [cvData, cvConfig, pushHistory, saveToLocalStorage]);

  const resetToDefaults = useCallback(() => {
    pushHistory(cvData, cvConfig);
    setCvData(cvJsonData as CVData);
    setCvConfig(DEFAULT_CONFIG);
    saveToLocalStorage(cvJsonData as CVData, DEFAULT_CONFIG);
  }, [cvData, cvConfig, pushHistory, saveToLocalStorage]);

  const undo = useCallback(() => {
    if (history.length > 0) {
      const newHistory = [...history];
      const prevState = newHistory.pop()!;
      setHistory(newHistory);
      setCvData(prevState.data);
      setCvConfig(prevState.config);
      saveToLocalStorage(prevState.data, prevState.config);
    }
  }, [history, saveToLocalStorage]);

  useEffect(() => {
    localStorage.setItem('cv-dark-mode', JSON.stringify(isDark));
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDark]);

  useEffect(() => {
    applyCSSVariables(cvConfig);
    injectFont(cvConfig.typography.headingFont);
    injectFont(cvConfig.typography.bodyFont);
  }, [cvConfig]);

  return (
    <CVContext.Provider value={{
      lang, toggleLang, isDark, toggleDark,
      cvData, cvConfig,
      updatePersonal, updateAbout, updateObjective, updateObjectiveImpacts, updateEducation, updateSkillList,
      updateAchievement, updateExperienceRole, updateHobbies,
      updateConfig, exportJSON, importJSON, resetToDefaults, undo, canUndo
    }}>
      {children}
    </CVContext.Provider>
  );
};

export const useCV = () => {
  const context = useContext(CVContext);
  if (context === undefined) {
    throw new Error('useCV must be used within a CVProvider');
  }
  return context;
};
