import { analytics } from "@repo/analytics/server";
import { flag } from "flags/next";

type CreateFlagOptions = {
  /** Optional: resolve user id for user-specific flags. If not provided, flags fall back to defaultValue. */
  getUserId?: () => Promise<string | null>;
};

export const createFlag = (key: string, options: CreateFlagOptions = {}) =>
  flag({
    key,
    defaultValue: false,
    async decide() {
      const userId = options.getUserId ? await options.getUserId() : null;

      if (!userId) {
        return this.defaultValue as boolean;
      }

      const isEnabled = await analytics.isFeatureEnabled(key, userId);

      return isEnabled ?? (this.defaultValue as boolean);
    },
  });
