import "./styles.css";
import { fonts } from "@repo/design-system/lib/fonts";
import type { ReactNode } from "react";
import { VoiceBotProvider } from "./context/VoiceBotContextProvider";

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => (
  <html className={fonts} lang="en" suppressHydrationWarning>
    <body>
      <VoiceBotProvider>{children}</VoiceBotProvider>
    </body>
  </html>
);

export default RootLayout;
