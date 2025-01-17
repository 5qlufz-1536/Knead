import React, { useState } from 'react'
import { SegmentedControl, SegmentedControlButton, HStack, Text, CardHeader, CardBody } from '@yamada-ui/react'

import { GlobeIcon } from '@yamada-ui/lucide'
import { useTranslation } from 'react-i18next'

export const LanguageChange = () => {
  const { i18n } = useTranslation()

  const [lang, setLang] = useState('')
  if (lang === '') setLang(localStorage.getItem('lang') ?? 'en')

  const onClickLang = (lang: string) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('lang', lang)
    window.myAPI.updateSettings({language: lang})
  }

  return (
    <>
      <CardHeader>
        <HStack>
          <GlobeIcon fontSize="xl" />
          <Text>Language / 言語</Text>
        </HStack>
      </CardHeader>
      <CardBody>
        <SegmentedControl value={i18n.language} onChange={onClickLang}>
          <SegmentedControlButton value="en">English</SegmentedControlButton>
          <SegmentedControlButton value="ja">日本語</SegmentedControlButton>
        </SegmentedControl>
      </CardBody>
    </>
  )
}
