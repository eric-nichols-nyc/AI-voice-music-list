import "./styles.css";
import { VoiceBotProvider } from "./context/VoiceBotContextProvider";
import { fonts } from "@repo/design-system/lib/fonts";
import { ThemeProvider } from "@repo/design-system/providers/theme";
import type { ReactNode } from "react";

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => (
  <html className={fonts} lang="en" suppressHydrationWarning>
    <body>
      <ThemeProvider>
        <VoiceBotProvider>{children}</VoiceBotProvider>
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;



