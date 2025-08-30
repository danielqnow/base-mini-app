import React from 'react';

type SplashScreenProps = {
  message?: string;
};

export function SplashScreen({ message = 'Loading…' }: SplashScreenProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        background: '#0b0b0c',
        color: 'white',
        zIndex: 9999,
      }}
      aria-busy="true"
      aria-live="polite"
    >
      <div style={{ display: 'grid', gap: 16, placeItems: 'center' }}>
        <img
          src="/splash-logo.svg"
          alt=""
          width={80}
          height={80}
          style={{ opacity: 0.9 }}
        />
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '9999px',
            border: '3px solid rgba(255,255,255,0.2)',
            borderTopColor: '#fff',
            animation: 'spin 1s linear infinite',
          }}
        />
        <div style={{ fontSize: 14, opacity: 0.8 }}>{message}</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
