import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setLoggedIn, verifyCredentials } from '../auth';
import lunaLogo from '@/assets/luna-logo.png';

const FONT = "'DM Sans', system-ui, sans-serif";

const IconBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      width: 30,
      height: 30,
      borderRadius: 8,
      background: '#1E293B',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}
  >
    {children}
  </div>
);

const svgBase = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: '#5B4FCF',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const FeatureRow: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
    <IconBox>{icon}</IconBox>
    <div>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: '#E2E8F0' }}>{title}</div>
      <div style={{ fontSize: 11.5, color: '#475569', marginTop: 2, lineHeight: 1.4 }}>{desc}</div>
    </div>
  </div>
);

const inputBase: React.CSSProperties = {
  width: '100%',
  height: 42,
  padding: '0 14px',
  border: '1px solid #E2E8F0',
  borderRadius: 10,
  background: '#fff',
  fontSize: 13.5,
  color: '#0F172A',
  outline: 'none',
  fontFamily: FONT,
};

const Login: React.FC = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const ok = await verifyCredentials(email, password);
      if (!ok) {
        setError('Invalid email or password');
        return;
      }
      await setLoggedIn();
      nav('/', { replace: true });
    } finally {
      setBusy(false);
    }
  };

  const focusOn = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = '#5B4FCF';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(91,79,207,0.08)';
  };
  const focusOff = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = '#E2E8F0';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row"
      style={{ fontFamily: FONT }}
    >
      {/* LEFT */}
      <div
        className="md:w-1/2"
        style={{
          background: '#0F172A',
          padding: '48px 56px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          {/* Logo row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
            <img src={lunaLogo} alt="Luna" width={36} height={36} style={{ borderRadius: 8 }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px', lineHeight: 1.1 }}>
                Luna x Hospital
              </div>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#475569',
                  marginTop: 2,
                }}
              >
                Clinical
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1.3,
              letterSpacing: '-0.4px',
              marginBottom: 8,
            }}
          >
            Fertility intelligence
            for your clinic
          </div>
          <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5, marginBottom: 32 }}>
            AI-powered patient health reports from wearable and lifestyle data — built for IVF specialists.
          </div>

          {/* Cycle phase bar */}
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                display: 'flex',
                height: 5,
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <div style={{ width: '17%', background: '#F4A7B9' }} />
              <div style={{ width: '30%', background: '#C4B5FD' }} />
              <div style={{ width: '3%', background: '#FCD34D' }} />
              <div style={{ flex: 1, background: '#5EEAD4' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 9.5, fontWeight: 600 }}>
              <span style={{ color: '#F4A7B9' }}>Menstrual</span>
              <span style={{ color: '#C4B5FD' }}>Follicular</span>
              <span style={{ color: '#FCD34D' }}>OV</span>
              <span style={{ color: '#5EEAD4' }}>Luteal</span>
            </div>
          </div>

          {/* Features */}
          <FeatureRow
            icon={
              <svg {...svgBase}>
                <path d="M3 12h4l2-5 3 10 2-7 2 4h5" />
              </svg>
            }
            title="Continuous biometric monitoring"
            desc="127-day wearable data — HRV, sleep, skin temp, SpO₂"
          />
          <FeatureRow
            icon={
              <svg {...svgBase}>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4l3 2" />
              </svg>
            }
            title="Cycle & AI-powered insights"
            desc="Biphasic temp analysis, ovulation detection, pattern flags"
          />
          <FeatureRow
            icon={
              <svg {...svgBase}>
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <path d="M8 10h8M8 14h5" />
              </svg>
            }
            title="Shareable clinical reports"
            desc="One-click PDF export with blood panel, habits, and AI summary"
          />
        </div>

        {/* Footer strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, color: '#334155', marginTop: 24 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981' }} />
          HIPAA-aligned · Patient data encrypted at rest · SOC 2 Type II
        </div>
      </div>

      {/* RIGHT */}
      <div
        className="md:w-[54%]"
        style={{
          background: '#FAFAF8',
          padding: '40px 44px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flex: 1,
        }}
      >
        <form onSubmit={onSubmit} style={{ width: '100%', maxWidth: 400, margin: '0 auto' }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#94A3B8',
              marginBottom: 6,
            }}
          >
            Luna x Hospital
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.5px', marginBottom: 4 }}>
            Welcome back
          </h1>
          <div style={{ fontSize: 13, color: '#64748B', marginBottom: 32 }}>
            Sign in to your clinical dashboard
          </div>

          {/* Email */}
          <label
            htmlFor="email"
            style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            placeholder="doctor@hospital.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={focusOn}
            onBlur={focusOff}
            required
            style={{ ...inputBase, marginBottom: 16 }}
          />

          {/* Password */}
          <label
            htmlFor="password"
            style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={focusOn}
            onBlur={focusOff}
            required
            style={inputBase}
          />

          {/* Forgot */}
          <div style={{ textAlign: 'right', marginTop: 10, marginBottom: 22 }}>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{ fontSize: 12, color: '#5B4FCF', fontWeight: 500, textDecoration: 'none' }}
            >
              Forgot password?
            </a>
          </div>

          {error && (
            <div style={{ fontSize: 12.5, color: '#DC2626', marginBottom: 14 }} role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            style={{
              width: '100%',
              height: 44,
              background: 'linear-gradient(135deg, #5B4FCF, #8B5CF6)',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: busy ? 'not-allowed' : 'pointer',
              opacity: busy ? 0.7 : 1,
              fontFamily: FONT,
              transition: 'filter 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>

          <div style={{ height: 1, background: '#F1F5F9', margin: '24px 0' }} />

          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            style={{
              width: '100%',
              height: 40,
              border: '1px solid #E2E8F0',
              borderRadius: 10,
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontSize: 13,
              fontWeight: 500,
              color: '#374151',
              cursor: 'pointer',
              fontFamily: FONT,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748B"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Continue with SSO
          </button>

          <div style={{ textAlign: 'center', marginTop: 22, fontSize: 12, color: '#94A3B8' }}>
            New to Luna?{' '}
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{ color: '#5B4FCF', fontWeight: 500, textDecoration: 'none' }}
            >
              Request access →
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;