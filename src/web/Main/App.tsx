import React from 'react'
import { VersionSelector } from '../Main/VersionSelector'
import { SoundSelector } from '../Main/SoundSelector'
import { Footer } from '../Main/Footer'
import { Configuration } from '../Main/Configuration'
import { VolumeChange } from '../Main/VolumeChange'
import { Separator, Flex, Spacer, Box, VStack, Button } from '@yamada-ui/react'

const { myAPI } = window

export const App = () => {
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
