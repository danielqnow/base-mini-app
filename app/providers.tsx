"use client";

import { type ReactNode, useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { base } from "wagmi/chains";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";

export function Providers(props: { children: ReactNode }) {
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await sdk.actions.ready();
      } catch {
        // ignore if not running inside a Mini App
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <MiniKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: "auto",
          theme: "mini-app-theme",
          name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
          logo: process.env.NEXT_PUBLIC_ICON_URL,
        },
      }}
    >
      {props.children}
    </MiniKitProvider>
  );
}
