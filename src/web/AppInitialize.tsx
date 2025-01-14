import React, { useState } from 'react'
import { useColorMode } from '@yamada-ui/react'
import { useTranslation } from 'react-i18next'

export const AppInitialize = () => {
  const { colorMode } = useColorMode()
  const { i18n } = useTranslation()

  const [lang, setLang] = useState('')
  if (lang === '') {
    const get_lang = localStorage.getItem('lang') ?? 'en'
    setLang(get_lang)
    i18n.changeLanguage(get_lang)
  }

  const style = document.createElement('style')
  style.textContent += '::-webkit-scrollbar { width: 7px; height: 7px; }'
  if (colorMode === 'light') {
    style.textContent += '::-webkit-scrollbar-track { background: var(--ui-colors-blackAlpha-200); border: none; }'
    style.textContent += '::-webkit-scrollbar-thumb { background: var(--ui-colors-blackAlpha-600); border-radius: 10px; }'
  }
  if (colorMode === 'dark') {
    style.textContent += '::-webkit-scrollbar-track { background: var(--ui-colors-whiteAlpha-200); border: none; }'
    style.textContent += '::-webkit-scrollbar-thumb { background: var(--ui-colors-whiteAlpha-600); border-radius: 10px; }'
  }
  document.head.appendChild(style)

  return (<></>)
}
