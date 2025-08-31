"use client";

import React, { useEffect, useRef } from "react";

type Props = {
  className?: string;
  // Optional fixed height; otherwise it stretches to parent height
  height?: number;
};

export default function FuturisticCanvasSpinner({ className, height = 260 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const resizeRef = useRef<ResizeObserver | null>(null);

  // Fit canvas to container with devicePixelRatio
  const fit = () => {
    const canvas = canvasRef.current!;
    const parent = containerRef.current!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = parent.clientWidth || 320;
    const h = parent.clientHeight || height;
    if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext("2d")!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    fit();

    // Observe size changes
    resizeRef.current = new ResizeObserver(() => fit());
    if (containerRef.current) resizeRef.current.observe(containerRef.current);

    // 3D-ish cube data
    const verts: [number, number, number][] = [
      [-1, -1, -1],
      [1, -1, -1],
      [-1, 1, -1],
      [1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [-1, 1, 1],
      [1, 1, 1],
    ];
    const edges: [number, number][] = [
      [0, 1],[1, 3],[3, 2],[2, 0],
      [4, 5],[5, 7],[7, 6],[6, 4],
      [0, 4],[1, 5],[2, 6],[3, 7],
    ];

    // Orbiting particles
    const particles = Array.from({ length: 90 }, (_, i) => ({
      baseR: 32 + Math.random() * 90,
      speed: 0.4 + Math.random() * 0.9,
      ang: Math.random() * Math.PI * 2,
      zMod: Math.random() * 0.8 + 0.2,
      hue: Math.random() > 0.5 ? 188 : 282, // teal / purple
      size: Math.random() * 1.6 + 0.6,
      phase: Math.random() * 10,
    }));

    let t0 = performance.now();
    const animate = (t: number) => {
      const dt = (t - t0) / 1000;
      t0 = t;

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const cx = w / 2;
      const cy = h / 2;

      // Clear with subtle radial vignette
      ctx.clearRect(0, 0, w, h);
      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(w, h) * 0.6);
      grad.addColorStop(0, "rgba(0,0,0,0.0)");
      grad.addColorStop(1, "rgba(0,0,0,0.35)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Parameters
      const time = t * 0.0015;
      const rotX = Math.sin(time * 0.9) * 0.7;
      const rotY = time * 1.2;
      const scale = Math.min(w, h) * 0.18;
      const perspective = 3.2;

      // Project 3D -> 2D
      const projected: [number, number][] = verts.map(([x, y, z]) => {
        // rotate around X
        let y1 = y * Math.cos(rotX) - z * Math.sin(rotX);
        let z1 = y * Math.sin(rotX) + z * Math.cos(rotX);
        // rotate around Y
        let x2 = x * Math.cos(rotY) + z1 * Math.sin(rotY);
        let z2 = -x * Math.sin(rotY) + z1 * Math.cos(rotY);

        const f = perspective / (perspective - z2);
        const sx = cx + x2 * scale * f;
        const sy = cy + y1 * scale * f;
        return [sx, sy];
      });

      // Draw orbiting particles
      ctx.globalCompositeOperation = "lighter";
      particles.forEach((p, idx) => {
        p.ang += p.speed * dt * (0.6 + 0.4 * Math.sin(time + p.phase));
        const r = p.baseR * (0.9 + 0.15 * Math.sin(time * 2 + idx));
        const x = cx + Math.cos(p.ang) * r;
        const y = cy + Math.sin(p.ang) * r * (0.65 + 0.35 * Math.sin(time * 0.7));
        const flicker = 0.6 + 0.4 * Math.abs(Math.sin(time * 3 + p.phase));
        ctx.shadowBlur = 12 * flicker;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 65%, 0.9)`;
        ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${0.55 * flicker})`;
        ctx.beginPath();
        ctx.arc(x, y, p.size * flicker, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw cube edges with neon glow
      ctx.lineWidth = 1.25;
      ctx.shadowBlur = 20;
      ctx.shadowColor = "rgba(0, 234, 255, 0.9)";
      ctx.strokeStyle = "rgba(0, 234, 255, 0.75)";
      edges.forEach(([a, b], i) => {
        ctx.beginPath();
        const [x1, y1] = projected[a];
        const [x2, y2] = projected[b];
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // occasional magenta pulses on some edges
        if (i % 3 === 0) {
          ctx.shadowColor = "rgba(185, 104, 255, 0.9)";
          ctx.strokeStyle = "rgba(185, 104, 255, 0.6)";
          ctx.stroke();
          ctx.shadowColor = "rgba(0, 234, 255, 0.9)";
          ctx.strokeStyle = "rgba(0, 234, 255, 0.75)";
        }
      });

      // Subtle circular rings
      ctx.shadowBlur = 8;
      ctx.lineWidth = 0.8;
      for (let i = 0; i < 3; i++) {
        const r = (Math.min(w, h) * (0.22 + i * 0.07)) * (1 + 0.02 * Math.sin(time * 2 + i));
        ctx.beginPath();
        ctx.strokeStyle = i % 2 ? "rgba(185,104,255,0.35)" : "rgba(0,234,255,0.35)";
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.globalCompositeOperation = "source-over";
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resizeRef.current && containerRef.current) resizeRef.current.unobserve(containerRef.current);
    };
  }, [height]);

  return (
    <div
      ref={containerRef}
      className={className ?? "w-full max-w-md"}
      style={{ height }}
      aria-label="Analyzing your algorithm animation"
      role="img"
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
