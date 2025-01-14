import React from 'react'
import { App } from './Main/App'
import { SubApp } from './Sub/App'
import { createRoot } from 'react-dom/client'
import { extendConfig, extendTheme, ThemeConfig, UIProvider, getColorModeScript } from '@yamada-ui/react'
import { HashRouter, Routes, Route } from 'react-router'
import { store } from '../store/_store'
import { Provider } from 'react-redux'
import './i18n/configs'

export const config: ThemeConfig = {
  initialColorMode: 'system',
}

const customConfig = extendConfig(config)

const customTheme = extendTheme({
  semantics: {
    colors: {
      black: ['#141414', '#1f1f1f'],
      white: ['#f8f8f8', '#cccccc'],
      footerBackground: ['#ffffff', '#181818'],
    },
  },
})()

const injectColorModeScript = () => {
  const scriptContent = getColorModeScript({
    initialColorMode: customConfig.initialColorMode,
  })

  const script = document.createElement('script')

  script.textContent = scriptContent

  document.head.appendChild(script)
}

injectColorModeScript()

createRoot(document.getElementById('root') as Element).render(
  <Provider store={store}>
    <UIProvider config={customConfig} theme={customTheme}>
      <HashRouter>
        <Routes>
          <Route index element={<App />} />
          <Route path="sub" element={<SubApp />} />
        </Routes>
      </HashRouter>
    </UIProvider>
  </Provider>,
)
