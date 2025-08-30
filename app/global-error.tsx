"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ padding: 16, fontFamily: "system-ui" }}>
        <h2>Something went wrong</h2>
        <p style={{ opacity: 0.7, fontSize: 14 }}>{error?.message}</p>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => reset()}>Try again</button>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      </body>
    </html>
  );
}
