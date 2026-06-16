export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  jobTitleVi: string;
  dob: string;
  location: string;
  phone: string;
  email: string;
  linkedinUrl: string;
  linkedinDisplay: string;
  portfolioUrl?: string;
  portfolioDisplay?: string;
  avatarUrl: string;
  hometown?: string;
}

export interface AboutSection {
  en: string;
  vi: string;
}

export interface ObjectiveImpacts {
  en: string[];
  vi: string[];
}

export interface ObjectiveSection {
  en: string;
  vi: string;
  impacts: ObjectiveImpacts;
}

export interface EducationInfo {
  school: string;
  major: string;
  subject: string;
  gpa: string;
  period: string;
}

export interface SkillsSection {
  frontend: string[];
  backend: string[];
  platform: string[];
  database: string[];
  devops: string[];
  ai?: string[];
  soft: string[];
  softVi?: string[];
}

export interface Achievement {
  year: string;
  titleEn: string;
  titleVi: string;
  org: string;
  badge: string;
  proofUrl: string;
}

export interface RoleBullets {
  en: string[];
  vi: string[];
}

export interface Role {
  titleEn: string;
  titleVi: string;
  period: string;
  periodVi?: string;
  skills: string;
  bullets: RoleBullets;
}

export interface Experience {
  company: string;
  companyVi?: string;
  period: string;
  periodVi?: string;
  location: string;
  roles: Role[];
}

export interface Hobby {
  label: string;
  labelVi: string;
  icon: string;
}

export interface Language {
  name: string;
  nameVi: string;
  level: string;
  levelVi: string;
}

export interface CVData {
  meta: {
    primaryColor: string;
    accentColor: string;
  };
  personal: PersonalInfo;
  about: AboutSection;
  objective: ObjectiveSection;
  education: EducationInfo;
  skills: SkillsSection;
  achievements: Achievement[];
  experience: Experience[];
  languages?: Language[];
  hobbies: Hobby[];
}

export interface CVConfig {
  colors: {
    primary: string;
    accent: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    baseFontSize: number;
  };
}

export interface CVAppState {
  data: CVData;
  config: CVConfig;
}
