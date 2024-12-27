import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";
import { extendConfig, extendTheme, ThemeConfig, UIProvider, getColorModeScript } from "@yamada-ui/react"



export const config: ThemeConfig = {
  initialColorMode: "system"
}

const customConfig = extendConfig(config);

const customTheme = extendTheme({
  semantics: {
    colors: {
      black: ["#141414","#1f1f1f"],
      white: ["#fbfbfb","#cccccc"]
    }
  }
})();



const injectColorModeScript = () => {
  const scriptContent = getColorModeScript({
    initialColorMode: customConfig.initialColorMode,
  })

  const script = document.createElement("script")

  script.textContent = scriptContent

  document.head.appendChild(script)
}

injectColorModeScript()




createRoot(document.getElementById("root") as Element).render(
  <StrictMode>
    <UIProvider config={customConfig} theme={customTheme}>
      <App />
    </UIProvider>
  </StrictMode>
);