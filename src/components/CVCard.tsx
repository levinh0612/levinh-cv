import React from 'react';
import { useCV } from '../context/CVContext';
import { CVHeader } from './CVHeader';
import { AboutSection } from './sections/About';
import { ObjectiveSection } from './sections/Objective';
import { EducationSection } from './sections/Education';
import { SkillsSection } from './sections/Skills';
import { AchievementsSection } from './sections/Achievements';
import { WorkExperienceSection } from './sections/WorkExperience';
import { HobbiesSection } from './sections/Hobbies';
import { LanguagesSection } from './sections/Languages';

export const CVCard: React.FC = () => {
  const { cvData } = useCV();

  return (
    <div id="cv-content">
      <header className="cv-header">
        <CVHeader personal={cvData.personal} />
      </header>

      <main className="cv-body">
        <AboutSection about={cvData.about} />
        <ObjectiveSection objective={cvData.objective} />
        <EducationSection education={cvData.education} />
        <SkillsSection skills={cvData.skills} />
        <WorkExperienceSection experience={cvData.experience} />
        <AchievementsSection achievements={cvData.achievements} />
        {cvData.languages && cvData.languages.length > 0 && (
          <LanguagesSection languages={cvData.languages} />
        )}
        <HobbiesSection hobbies={cvData.hobbies} />
      </main>

      <footer className="cv-footer">
        <span className="cv-footer-text">{cvData.personal.fullName} &nbsp;·&nbsp; {cvData.personal.email}</span>
        <div className="cv-footer-bar"></div>
      </footer>
    </div>
  );
};
