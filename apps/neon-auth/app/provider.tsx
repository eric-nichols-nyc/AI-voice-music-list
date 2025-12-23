// app/provider.tsx
"use client";

import { NeonAuthUIProvider } from "@neondatabase/neon-auth-ui";
import { authClient } from "@/lib/auth/client";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <NeonAuthUIProvider
      authClient={authClient}
      redirectTo="/dashboard"
      social={{
        providers: ["google"],
      }}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
