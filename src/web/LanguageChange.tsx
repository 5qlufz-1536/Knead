import React from 'react'
import { Menu, MenuButton, MenuList, MenuItem, IconButton, Box } from '@yamada-ui/react'

import { CheckIcon, LanguagesIcon } from '@yamada-ui/lucide'
import { useTranslation } from 'react-i18next'

export const LanguageChange = () => {
  const { i18n } = useTranslation()

  return (
    <Menu animation="top" gutter={0}>
      <MenuButton as={IconButton} icon={<LanguagesIcon fontSize="lg" />} variant="outline" />

      <MenuList style={{ padding: 0, margin: 0 }}>
        <MenuItem
          icon={<CheckIcon opacity={i18n.language === 'en' ? 1 : 0} fontSize="lg" />}
          onClick={() => i18n.changeLanguage('en')}
        >
          <Box paddingBottom={0.5}>English</Box>
        </MenuItem>
        <MenuItem
          icon={<CheckIcon opacity={i18n.language === 'ja' ? 1 : 0} fontSize="lg" />}
          onClick={() => i18n.changeLanguage('ja')}
        >
          <Box paddingBottom={0.5}>日本語</Box>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
