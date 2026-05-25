import React, { useState } from 'react';
import { useCV } from '../../context/CVContext';
import { useInView } from '../../hooks/useInView';
import type { Achievement } from '../../types/cv';
import { Lightbox } from '../Lightbox';

interface AchievementsSectionProps {
  achievements: Achievement[];
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({ achievements }) => {
  const { lang } = useCV();
  const { ref, inView } = useInView();
  const [lightboxSrc, setLightboxSrc] = useState('');

  return (
    <div ref={ref} className={`mb-8 reveal-stagger${inView ? ' is-visible' : ''}`}>
      <div className="section-heading-block">
        <span>{lang === 'en' ? 'ACHIEVEMENTS' : 'THÀNH TÍCH NỔI BẬT'}</span>
      </div>

      <div className="ach-cards">
        {achievements.map((ach, idx) => {
          const title = lang === 'en' ? ach.titleEn : ach.titleVi;
          const badgeMap: Record<string, [string, string]> = {
            merit:        ['Certificate of Merit', 'Giấy Khen'],
            commendation: ['Letter of Commendation', 'Thư Khen'],
            award:        ['Award', 'Khen Thưởng'],
          };
          const [badgeEn, badgeVi] = badgeMap[ach.badge] ?? badgeMap.award;
          const badgeText = lang === 'en' ? badgeEn : badgeVi;

          return (
            <div key={idx} className="ach-card">
              <div className="ach-card-main">
                <span className="ach-year-pill">{ach.year}</span>
                <div className="ach-card-info">
                  <div className="ach-title">{title}</div>
                  <div className="ach-meta">
                    <span className="ach-org">{ach.org}</span>
                    <span className={`ach-badge ach-badge-${ach.badge}`}>{badgeText}</span>
                  </div>
                </div>
              </div>
              <div className="ach-proof">
                {ach.proofUrl ? (
                  <img
                    src={ach.proofUrl}
                    alt="Proof"
                    title={lang === 'en' ? 'Click to view' : 'Nhấn để xem'}
                    style={{ width: 68, height: 52, objectFit: 'cover', borderRadius: 3, border: '1.5px solid var(--border)', cursor: 'pointer', transition: 'border-color .2s, transform .2s, box-shadow .2s', display: 'block' }}
                    onClick={() => setLightboxSrc(ach.proofUrl)}
                  />
                ) : (
                  <div className="ach-proof-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Lightbox src={lightboxSrc} isOpen={!!lightboxSrc} onClose={() => setLightboxSrc('')} />
    </div>
  );
};
