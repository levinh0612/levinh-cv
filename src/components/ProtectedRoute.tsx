import React, { useState, useRef, useEffect } from 'react';
import { ADMIN_PASSWORD } from '../config/admin';

const IS_LOCAL = import.meta.env.DEV;

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [authed, setAuthed] = useState(() => IS_LOCAL || sessionStorage.getItem('admin-auth') === '1');
  const [input, setInput] = useState('');
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authed) setTimeout(() => inputRef.current?.focus(), 100);
  }, [authed]);

  if (authed) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin-auth', '1');
      setAuthed(true);
    } else {
      setAttempts(a => a + 1);
      setShake(true);
      setInput('');
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0f1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        width: 360,
        padding: '40px 36px',
        background: '#0f1923',
        border: '1px solid #1e2d3d',
        borderRadius: 12,
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        animation: shake ? 'gateShake .4s ease' : 'gateIn .4s cubic-bezier(.16,1,.3,1) both',
      }}>
        <div style={{ marginBottom: 28, textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48,
            background: 'linear-gradient(135deg, #1a2b4a, #c8963e)',
            borderRadius: 12,
            margin: '0 auto 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem',
          }}>
            🔐
          </div>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#c8d8e8', margin: 0 }}>
            Admin Access
          </h1>
          <p style={{ fontSize: '0.78rem', color: '#5a7a9a', marginTop: 6 }}>
            This area is restricted
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            ref={inputRef}
            type="password"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Enter password"
            autoComplete="current-password"
            style={{
              background: '#0d1826',
              border: `1.5px solid ${attempts > 0 && !shake ? '#ef4444' : '#1e2d3d'}`,
              borderRadius: 8,
              padding: '11px 14px',
              color: '#c8d8e8',
              fontSize: '0.9rem',
              fontFamily: "'Inter', sans-serif",
              outline: 'none',
              width: '100%',
              transition: 'border-color .2s',
            }}
            onFocus={e => { e.target.style.borderColor = '#c8963e'; }}
            onBlur={e => { e.target.style.borderColor = attempts > 0 ? '#ef4444' : '#1e2d3d'; }}
          />

          {attempts > 0 && !shake && (
            <p style={{ fontSize: '0.75rem', color: '#ef4444', margin: 0 }}>
              Incorrect password. {attempts > 2 ? `${attempts} attempts.` : ''}
            </p>
          )}

          <button
            type="submit"
            style={{
              background: 'linear-gradient(135deg, #1a2b4a, #243d60)',
              border: '1px solid #2d4a66',
              borderRadius: 8,
              padding: '11px',
              color: '#c8d8e8',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all .2s',
            }}
            onMouseEnter={e => { (e.target as HTMLElement).style.background = 'linear-gradient(135deg, #c8963e, #d4a44a)'; (e.target as HTMLElement).style.color = '#0f1923'; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.background = 'linear-gradient(135deg, #1a2b4a, #243d60)'; (e.target as HTMLElement).style.color = '#c8d8e8'; }}
          >
            Enter
          </button>
        </form>
      </div>

      <style>{`
        @keyframes gateIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes gateShake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-10px); }
          40%      { transform: translateX(10px); }
          60%      { transform: translateX(-8px); }
          80%      { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
};
