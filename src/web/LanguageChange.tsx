import React from 'react'
import { Menu, MenuButton, MenuList, MenuItem, IconButton, Box } from '@yamada-ui/react'

import { CheckIcon, GlobeIcon } from '@yamada-ui/lucide'
import { useTranslation } from 'react-i18next'
import { useAddDispatch } from '../store/_store'
import { updateLanguage } from '../store/fetchSlice'

export const LanguageChange = () => {
  const { i18n } = useTranslation()
  const dispatch = useAddDispatch()

  const onClickLang = (lang: string) => {
    i18n.changeLanguage(lang)
    dispatch(updateLanguage({ lang }))
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
          onClick={() => i18n.changeLanguage('ja')}
        >
          <Box paddingBottom={0.5}>日本語</Box>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
