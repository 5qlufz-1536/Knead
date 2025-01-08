import React, { useState } from 'react'
import { Menu, MenuButton, MenuList, MenuItem, IconButton, Box } from '@yamada-ui/react'

import { CheckIcon, GlobeIcon } from '@yamada-ui/lucide'
import { useTranslation } from 'react-i18next'

export const LanguageChange = () => {
  const { i18n } = useTranslation()

  const [lang, setLang] = useState('')
  if (lang === '') {
    const get_lang = localStorage.getItem('lang') ?? 'ja'
    setLang(get_lang)
    i18n.changeLanguage(get_lang)
  }

  const onClickLang = (lang: string) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('lang', lang)
  }

  return (
    <Menu animation="top" gutter={0}>
      <MenuButton as={IconButton} icon={<GlobeIcon fontSize="lg" />} variant="outline" />

      <MenuList style={{ padding: 0, margin: 0 }}>
        <MenuItem
          icon={<CheckIcon opacity={i18n.language === 'en' ? 1 : 0} fontSize="lg" />}
          onClick={() => onClickLang('en')}
        >
          <Box paddingBottom={0.5}>English</Box>
        </MenuItem>
        <MenuItem
          icon={<CheckIcon opacity={i18n.language === 'ja' ? 1 : 0} fontSize="lg" />}
          onClick={() => onClickLang('ja')}
        >
          <Box paddingBottom={0.5}>日本語</Box>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
