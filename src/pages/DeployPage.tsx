import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, RefreshCw, ExternalLink, Copy, Check,
  Globe, Zap, AlertCircle, Clock, CheckCircle, XCircle,
  Settings, Rocket, Link
} from 'lucide-react';

interface VercelDeployment {
  uid: string;
  url: string;
  name: string;
  state: 'READY' | 'ERROR' | 'BUILDING' | 'QUEUED' | 'CANCELED';
  createdAt: number;
  target: 'production' | 'preview' | null;
  meta?: {
    githubCommitMessage?: string;
    githubBranch?: string;
  };
}

interface VercelProject {
  id: string;
  name: string;
  alias?: { domain: string; target: string }[];
  latestDeployments?: VercelDeployment[];
}

interface DeployConfig {
  token: string;
  projectId: string;
  deployHookUrl: string;
}

const STORAGE_KEY = 'vercel-deploy-config';
const DEFAULT_PROJECT_ID = 'prj_QgVpsFKghr0iW4QGEOxan5orcwaF';
const DEFAULT_PROJECT_NAME = 'levinh-cv';
const DEFAULT_TOKEN = '';

const STATUS_CONFIG = {
  READY:    { label: 'Ready',    color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   icon: CheckCircle },
  ERROR:    { label: 'Error',    color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   icon: XCircle },
  BUILDING: { label: 'Building', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: RefreshCw },
  QUEUED:   { label: 'Queued',   color: '#6b7280', bg: 'rgba(107,114,128,0.1)', icon: Clock },
  CANCELED: { label: 'Canceled', color: '#6b7280', bg: 'rgba(107,114,128,0.1)', icon: XCircle },
};

function StatusBadge({ state }: { state: VercelDeployment['state'] }) {
  const cfg = STATUS_CONFIG[state] ?? STATUS_CONFIG.QUEUED;
  const Icon = cfg.icon;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 100,
      background: cfg.bg, color: cfg.color,
      fontSize: '0.75rem', fontWeight: 700,
    }}>
      <Icon size={11} style={state === 'BUILDING' ? { animation: 'spin 1s linear infinite' } : {}} />
      {cfg.label}
    </span>
  );
}

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="deploy-icon-btn" title="Copy">
      {copied ? <Check size={13} style={{ color: '#22c55e' }} /> : <Copy size={13} />}
    </button>
  );
}

export const DeployPage: React.FC = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<DeployConfig>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return {
        token: saved.token || DEFAULT_TOKEN,
        projectId: saved.projectId || DEFAULT_PROJECT_ID,
        deployHookUrl: saved.deployHookUrl || '',
      };
    } catch {
      return { token: DEFAULT_TOKEN, projectId: DEFAULT_PROJECT_ID, deployHookUrl: '' };
    }
  });
  const [showToken, setShowToken] = useState(false);
  const [project, setProject] = useState<VercelProject | null>(null);
  const [deployments, setDeployments] = useState<VercelDeployment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [redeployLoading, setRedeployLoading] = useState(false);
  const [redeployResult, setRedeployResult] = useState<'success' | 'error' | null>(null);
  const [configOpen, setConfigOpen] = useState(!config.token);

  const saveConfig = (next: Partial<DeployConfig>) => {
    const updated = { ...config, ...next };
    setConfig(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const fetchData = useCallback(async () => {
    if (!config.token || !config.projectId) return;
    setLoading(true);
    setError('');
    try {
      const headers = { Authorization: `Bearer ${config.token}` };

      const [projRes, deplRes] = await Promise.all([
        fetch(`https://api.vercel.com/v9/projects/${config.projectId}`, { headers }),
        fetch(`https://api.vercel.com/v6/deployments?projectId=${config.projectId}&limit=15`, { headers }),
      ]);

      if (!projRes.ok) throw new Error(`Project error ${projRes.status}: ${await projRes.text()}`);
      if (!deplRes.ok) throw new Error(`Deployments error ${deplRes.status}: ${await deplRes.text()}`);

      const [projData, deplData] = await Promise.all([projRes.json(), deplRes.json()]);
      setProject(projData);
      setDeployments(deplData.deployments ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [config.token, config.projectId]);

  useEffect(() => {
    if (config.token && config.projectId) fetchData();
  }, [fetchData, config.token, config.projectId]);

  const handleRedeploy = async () => {
    const latestProd = deployments.find(d => d.target === 'production');
    if (!latestProd) return;
    setRedeployLoading(true);
    setRedeployResult(null);
    try {
      const res = await fetch(
        `https://api.vercel.com/v13/deployments/${latestProd.uid}/redeploy`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${config.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ target: 'production' }),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      setRedeployResult('success');
      setTimeout(() => fetchData(), 4000);
      setTimeout(() => fetchData(), 9000);
    } catch {
      setRedeployResult('error');
    } finally {
      setRedeployLoading(false);
    }
  };

  const productionDomain = 'cv-lv.vercel.app';
  const latestProdDeployment = deployments.find(d => d.target === 'production');

  const hasConfig = config.token && config.projectId;

  return (
    <div className="deploy-page">
      {/* Header */}
      <div className="deploy-header">
        <button onClick={() => navigate('/dashboard')} className="deploy-nav-btn">
          <ChevronLeft size={16} /> Dashboard
        </button>
        <div className="deploy-header-center">
          <Rocket size={18} style={{ color: '#c8963e' }} />
          <span className="deploy-title">Vercel Deployment</span>
          <span className="deploy-project-name">{project?.name ?? DEFAULT_PROJECT_NAME}</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {hasConfig && (
            <button onClick={fetchData} disabled={loading} className="deploy-btn-secondary">
              <RefreshCw size={13} style={loading ? { animation: 'spin 1s linear infinite' } : {}} />
              Refresh
            </button>
          )}
          <button
            onClick={() => window.open(`https://vercel.com/dashboard`, '_blank')}
            className="deploy-btn-secondary"
          >
            <ExternalLink size={13} /> Vercel Dashboard
          </button>
        </div>
      </div>

      <div className="deploy-content">
        {/* Config Section */}
        <div className="deploy-card">
          <button
            className="deploy-section-toggle"
            onClick={() => setConfigOpen(o => !o)}
          >
            <Settings size={15} />
            <span>Configuration</span>
            <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#5a7a9a' }}>
              {configOpen ? '▲' : '▼'}
            </span>
          </button>

          {configOpen && (
            <div className="deploy-config-body">
              <div className="deploy-field-row">
                <div className="deploy-field">
                  <label className="deploy-label">Vercel API Token</label>
                  <div className="deploy-input-row">
                    <input
                      type={showToken ? 'text' : 'password'}
                      value={config.token}
                      onChange={e => saveConfig({ token: e.target.value })}
                      placeholder="Enter your Vercel API token..."
                      className="deploy-input"
                    />
                    <button onClick={() => setShowToken(v => !v)} className="deploy-icon-btn">
                      {showToken ? '🙈' : '👁️'}
                    </button>
                  </div>
                  <span className="deploy-hint">
                    Get it at <a href="https://vercel.com/account/tokens" target="_blank" rel="noopener noreferrer" className="deploy-link">vercel.com/account/tokens</a>
                  </span>
                </div>

                <div className="deploy-field">
                  <label className="deploy-label">Project ID</label>
                  <input
                    type="text"
                    value={config.projectId}
                    onChange={e => saveConfig({ projectId: e.target.value })}
                    placeholder="prj_xxxxxxxxxxxxxxxx"
                    className="deploy-input"
                  />
                  <span className="deploy-hint">Found in Project Settings → General</span>
                </div>
              </div>

              <div className="deploy-field">
                <label className="deploy-label">Deploy Hook URL <span style={{ color: '#5a7a9a', fontWeight: 400 }}>(optional — for trigger button)</span></label>
                <input
                  type="text"
                  value={config.deployHookUrl}
                  onChange={e => saveConfig({ deployHookUrl: e.target.value })}
                  placeholder="https://api.vercel.com/v1/integrations/deploy/..."
                  className="deploy-input"
                />
                <span className="deploy-hint">Create at Project → Settings → Git → Deploy Hooks</span>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="deploy-error">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {!hasConfig && (
          <div className="deploy-empty">
            <Rocket size={40} style={{ color: '#2d4a66', marginBottom: 12 }} />
            <p>Configure your Vercel API Token and Project ID to see deployment status.</p>
          </div>
        )}

        {hasConfig && (
          <>
            {/* Big Deploy Button */}
            <div className="deploy-card" style={{ padding: '24px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#5a7a9a', marginBottom: 6 }}>
                    Production
                  </div>
                  <a
                    href="https://cv-lv.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#c8963e', fontSize: '0.95rem', fontWeight: 600, textDecoration: 'none' }}
                  >
                    cv-lv.vercel.app <ExternalLink size={13} />
                  </a>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                    {latestProdDeployment && <StatusBadge state={latestProdDeployment.state} />}
                    {latestProdDeployment && (
                      <span style={{ fontSize: '0.75rem', color: '#5a7a9a' }}>
                        {timeAgo(latestProdDeployment.createdAt)}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <button
                    onClick={handleRedeploy}
                    disabled={redeployLoading || !latestProdDeployment}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '13px 28px',
                      background: redeployLoading ? '#243d60' : 'linear-gradient(135deg, #c8963e, #d4a44a)',
                      border: 'none',
                      borderRadius: 8,
                      color: redeployLoading ? '#c8d8e8' : '#0f1923',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      cursor: redeployLoading || !latestProdDeployment ? 'not-allowed' : 'pointer',
                      opacity: !latestProdDeployment ? 0.5 : 1,
                      transition: 'all .2s',
                      boxShadow: redeployLoading ? 'none' : '0 4px 20px rgba(200,150,62,.35)',
                      letterSpacing: '.03em',
                    }}
                  >
                    {redeployLoading
                      ? <><RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> Deploying...</>
                      : <><Rocket size={16} /> Deploy to Production</>
                    }
                  </button>
                  {redeployResult === 'success' && (
                    <span style={{ fontSize: '0.75rem', color: '#22c55e', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle size={12} /> Deploy triggered! Refreshing in a moment...
                    </span>
                  )}
                  {redeployResult === 'error' && (
                    <span style={{ fontSize: '0.75rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <XCircle size={12} /> Failed — check token permissions
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="deploy-status-row">
              <div className="deploy-card deploy-stat-card">
                <div className="deploy-stat-icon"><Globe size={20} style={{ color: '#c8963e' }} /></div>
                <div>
                  <div className="deploy-stat-label">Domain</div>
                  <a href="https://cv-lv.vercel.app" target="_blank" rel="noopener noreferrer" className="deploy-stat-value deploy-link">
                    cv-lv.vercel.app <ExternalLink size={11} />
                  </a>
                </div>
              </div>

              <div className="deploy-card deploy-stat-card">
                <div className="deploy-stat-icon"><Zap size={20} style={{ color: '#c8963e' }} /></div>
                <div>
                  <div className="deploy-stat-label">Latest Production</div>
                  <div className="deploy-stat-value">
                    {latestProdDeployment
                      ? <StatusBadge state={latestProdDeployment.state} />
                      : <span style={{ color: '#5a7a9a' }}>—</span>
                    }
                  </div>
                </div>
              </div>

              <div className="deploy-card deploy-stat-card">
                <div className="deploy-stat-icon"><Link size={20} style={{ color: '#c8963e' }} /></div>
                <div>
                  <div className="deploy-stat-label">Total Deployments</div>
                  <div className="deploy-stat-value">{deployments.length}</div>
                </div>
              </div>
            </div>

            {/* Deployments Table */}
            <div className="deploy-card">
              <div className="deploy-table-header">
                <span className="deploy-section-title">Recent Deployments</span>
                <span style={{ fontSize: '0.75rem', color: '#5a7a9a' }}>{deployments.length} entries</span>
              </div>

              {loading ? (
                <div className="deploy-loading">
                  <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite', color: '#c8963e' }} />
                  <span>Loading deployments...</span>
                </div>
              ) : deployments.length === 0 ? (
                <div className="deploy-empty" style={{ padding: '32px 0' }}>
                  <p>No deployments found for this project.</p>
                </div>
              ) : (
                <div className="deploy-table-wrap">
                  <table className="deploy-table">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Target</th>
                        <th>URL</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deployments.map(dep => (
                        <tr key={dep.uid} className="deploy-table-row">
                          <td><StatusBadge state={dep.state} /></td>
                          <td>
                            <span className={`deploy-target-badge ${dep.target === 'production' ? 'deploy-target-prod' : 'deploy-target-preview'}`}>
                              {dep.target === 'production' ? '⚡ Production' : '🔍 Preview'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span className="deploy-url-text">{dep.url}</span>
                              <CopyButton text={`https://${dep.url}`} />
                            </div>
                          </td>
                          <td className="deploy-time">{timeAgo(dep.createdAt)}</td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <a href={`https://${dep.url}`} target="_blank" rel="noopener noreferrer" className="deploy-icon-btn" title="Open">
                                <ExternalLink size={13} />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* CLI Commands */}
            <div className="deploy-card">
              <div className="deploy-section-title" style={{ marginBottom: 12 }}>Quick Commands</div>
              <div className="deploy-commands">
                {[
                  { label: 'Preview deploy', cmd: 'vercel' },
                  { label: 'Production deploy', cmd: 'vercel --prod' },
                  { label: 'View logs', cmd: `vercel logs ${productionDomain ?? '<deployment-url>'}` },
                  { label: 'Pull env vars', cmd: 'vercel env pull .env.local' },
                ].map(({ label, cmd }) => (
                  <div key={cmd} className="deploy-cmd-row">
                    <span className="deploy-cmd-label">{label}</span>
                    <div className="deploy-cmd-block">
                      <code className="deploy-cmd-code">{cmd}</code>
                      <CopyButton text={cmd} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
