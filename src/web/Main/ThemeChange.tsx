import React from 'react'
import { useColorMode, HStack, Text, SegmentedControl, SegmentedControlButton, ColorModeWithSystem, CardBody, CardHeader } from '@yamada-ui/react'

import { MoonIcon, PaletteIcon, SunIcon, MonitorCogIcon } from '@yamada-ui/lucide'
import { useTranslation } from 'react-i18next'

export const ThemeChange = () => {
  const { changeColorMode, internalColorMode } = useColorMode()
  const { t } = useTranslation()

  const getColorModeWithSystem = (v: string): ColorModeWithSystem => {
    if (v == 'system') return 'system'
    if (v == 'light') return 'light'
    if (v == 'dark') return 'dark'
    return internalColorMode
  }

  return (
    <>
      <CardHeader>
        <HStack>
          <PaletteIcon fontSize="xl" />
          <Text>{t('theme_select')}</Text>
        </HStack>
      </CardHeader>
      <CardBody>
        <SegmentedControl value={internalColorMode} onChange={v => changeColorMode(getColorModeWithSystem(v))}>
          <SegmentedControlButton value="system">
            <HStack>
              <MonitorCogIcon fontSize="xl" />
              <Text>System</Text>
            </HStack>
          </SegmentedControlButton>
          <SegmentedControlButton value="light">
            <HStack>
              <SunIcon fontSize="xl" />
              <Text>Light</Text>
            </HStack>
          </SegmentedControlButton>
          <SegmentedControlButton value="dark">
            <HStack>
              <MoonIcon fontSize="xl" />
              <Text>Dark</Text>
            </HStack>
          </SegmentedControlButton>
        </SegmentedControl>
      </CardBody>
    </>
  )
}
