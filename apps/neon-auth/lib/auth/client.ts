"use client";

import { createAuthClient } from "@neondatabase/neon-auth-next";

export const authClient: ReturnType<typeof createAuthClient> =
  createAuthClient();
