
import { App } from "./App";
import { createRoot } from "react-dom/client";
import { extendConfig, extendTheme, ThemeConfig, UIProvider, getColorModeScript, useSystemColorMode } from "@yamada-ui/react"



export const config: ThemeConfig = {
  initialColorMode: "system"
}

const customConfig = extendConfig(config);

const customTheme = extendTheme({
  semantics: {
    colors: {
      black: ["#141414", "#1f1f1f"],
      white: ["#fbfbfb", "#cccccc"]
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
  <UIProvider config={customConfig} theme={customTheme}>
    <App />
  </UIProvider>

);