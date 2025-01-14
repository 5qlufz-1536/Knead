import './App.css'
import React, { useState } from 'react'
import { VersionSelector } from './VersionSelector'
import { SoundSelector } from './SoundSelector'
import { Footer } from './Footer'
import { Configuration } from './Configuration'
import { VolumeChange } from './VolumeChange'
import { Separator, Flex, Spacer, useColorMode, Box, VStack, Button } from '@yamada-ui/react'
import { useTranslation } from 'react-i18next'

const { myAPI } = window

export const App = () => {
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

  const openSubWindow = () => {
    myAPI.make_sub_window()
  }

  return (
    <>
      <VStack h="100vh">
        <Box padding={2}>
          <Flex w="full" gap={2} paddingBottom={0}>
            <VersionSelector />

            <Spacer />

            <VolumeChange />
            <Button onClick={openSubWindow}>test</Button>
            <Configuration />
          </Flex>
          <Separator marginY={2} size="xs" />
          <SoundSelector />
        </Box>
        <Footer />
      </VStack>
    </>
  )
}
