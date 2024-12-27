import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";
import { extendConfig, extendTheme, ThemeConfig, UIProvider, getColorModeScript } from "@yamada-ui/react"


export const config: ThemeConfig = {
  initialColorMode: "dark"
}

const customConfig = extendConfig(config)

const customTheme = extendTheme({

})();



// const injectColorModeScript = () => {
//   const scriptContent = getColorModeScript({
//     initialColorMode: customConfig.initialColorMode,
//   })

//   const script = document.createElement("script")

//   script.textContent = scriptContent

//   document.head.appendChild(script)
// }

// injectColorModeScript()




createRoot(document.getElementById("root") as Element).render(
  // <StrictMode>
    <UIProvider config={customConfig}>
      <App />
    </UIProvider>
  // </StrictMode>
);