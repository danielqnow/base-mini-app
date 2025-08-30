"use client";

import React, { useEffect, useRef } from "react";

export function CubeLoader() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cleanupRef = useRef<() => void>();

  useEffect(() => {
    let stop = false;

    (async () => {
      const THREE = await import("three");

      if (!containerRef.current) return;

      const width = containerRef.current.clientWidth || 200;
      const height = containerRef.current.clientHeight || 200;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.z = 3;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      containerRef.current.appendChild(renderer.domElement);

      // Wireframe cube
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({
        color: 0x006989, // var(--app-accent)
        wireframe: true,
        transparent: true,
        opacity: 0.9,
      });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      const animate = () => {
        if (stop) return;
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
      };
      animate();

      cleanupRef.current = () => {
        stop = true;
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        if (containerRef.current && renderer.domElement.parentElement === containerRef.current) {
          containerRef.current.removeChild(renderer.domElement);
        }
      };
    })();

    return () => {
      cleanupRef.current?.();
    };
  }, []);

  return (
    <div
      id="cube-container"
      ref={containerRef}
      className="cube-container"
      aria-hidden="true"
    />
  );
}
