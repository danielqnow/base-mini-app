"use client";

import { useEffect } from "react";

export default function ChunkLoadGuard() {
  useEffect(() => {
    const markOnce = () => {
      const key = "__chunk_reload_once__";
      if (typeof window === "undefined") return false;
      if (sessionStorage.getItem(key)) return false;
      sessionStorage.setItem(key, "1");
      return true;
    };

    const hardRecover = () => {
      if (!markOnce()) return;
      try {
        // Clear caches and unregister SW to avoid stale chunks
        if ("caches" in window) {
          caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
        }
        if (navigator.serviceWorker?.getRegistrations) {
          navigator.serviceWorker
            .getRegistrations()
            .then((regs) => regs.forEach((r) => r.unregister()));
        }
      } catch {
        // no-op
      }
      window.location.reload();
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason as any;
      const name = reason?.name ?? "";
      const msg =
        typeof reason === "string" ? reason : reason?.message ?? String(reason ?? "");
      if (
        name === "ChunkLoadError" ||
        msg.includes("ChunkLoadError") ||
        msg.includes("Loading chunk")
      ) {
        event.preventDefault?.();
        hardRecover();
      }
    };

    const onError = (event: ErrorEvent) => {
      const msg = event.message ?? "";
      if (msg.includes("ChunkLoadError") || msg.includes("Loading chunk")) {
        hardRecover();
      }
    };

    window.addEventListener("unhandledrejection", onUnhandledRejection);
    window.addEventListener("error", onError);
    return () => {
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
      window.removeEventListener("error", onError);
    };
  }, []);

  return null;
}
