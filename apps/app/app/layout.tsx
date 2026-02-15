import "./styles.css";
import { ThemeProvider as AppThemeProvider } from "./context/ThemeContext";
import { fonts } from "@repo/design-system/lib/fonts";
import type { ReactNode } from "react";
import { VoiceBotProvider } from "./context/VoiceBotContextProvider";

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => (
  <html className={fonts} lang="en" suppressHydrationWarning>
    <body>
      <VoiceBotProvider>
        <AppThemeProvider>{children}</AppThemeProvider>
      </VoiceBotProvider>
    </body>
  </html>
);

export default RootLayout;
