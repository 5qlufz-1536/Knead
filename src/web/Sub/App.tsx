import '../App.css'
import React, { useState } from 'react'
import { useColorMode, Box, VStack, Reorder, ReorderItem, ReorderTrigger, HStack, Text } from '@yamada-ui/react'
import { useTranslation } from 'react-i18next'

export const SubApp = () => {
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

  const items = ['test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7', 'test8', 'test9', 'test10'].map(item => (
    <ReorderItem value={item} key={item}>
      <HStack>
        <ReorderTrigger />
        <Text>{item}</Text>
      </HStack>
    </ReorderItem>
  ))

  return (
    <>
      <VStack h="100vh">
        <Box padding={2}>
          <Reorder>
            {items}
          </Reorder>
        </Box>
      </VStack>
    </>
  )
}
