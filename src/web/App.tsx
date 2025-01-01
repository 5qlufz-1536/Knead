import './App.css'
import React, { useEffect } from 'react'
import { VersionSelector } from './VersionSelector'
import { SoundSelector } from './SoundSelector'
import { ThemeChange } from './ThemeChange'
import { Footer } from './Footer'
import { Configuration } from './Configuration'
import { VolumeChange } from './VolumeChange'
import { LanguageChange } from './LanguageChange'
import { useAppSelector } from '../store/_store'
import { Separator, Flex, Spacer, useColorMode, Box, VStack } from '@yamada-ui/react'

const { myAPI } = window

export const App = () => {
  const targetVersion = useAppSelector(state => state.fetch.targetVersion)?.raw
  const soundRatings = useAppSelector(state => state.fetch.soundRatings)
  const volumeSlider = useAppSelector(state => state.fetch.volumeSlider)

  useEffect(() => {
    (async () => {
      try {
        // const loaded = await myAPI.load()
      }
      catch (e: unknown) {
        alert(e)
      }
    })()
  }, [])

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       await myAPI.save(JSON.stringify({ volume: volumeSlider }), JSON.stringify(soundRatings), JSON.stringify({ version: targetVersion }))
  //     }
  //     catch (e: unknown) {
  //       alert(e)
  //     }
  //   })()
  // }, [soundRatings, targetVersion, volumeSlider])

  const { colorMode } = useColorMode()

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

  return (
    <>
      <VStack h="100vh">
        <Box padding={2}>
          <Flex w="full" gap="md" paddingBottom={0}>
            <VersionSelector />

            <Spacer />

            <VolumeChange />
            <LanguageChange />
            <ThemeChange />
            {/* <Configuration /> */}
          </Flex>
          <Separator marginY={2} size="xs" />
          <SoundSelector />
        </Box>
        <Footer />
      </VStack>
    </>
  )
}
