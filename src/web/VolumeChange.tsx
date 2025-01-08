import React, { useState } from 'react'
import { Volume1Icon, Volume2Icon, VolumeOffIcon, VolumeXIcon } from '@yamada-ui/lucide'
import { Box, Flex, Slider, Toggle, useBoolean } from '@yamada-ui/react'

export const VolumeChange = () => {
  const [MuteSwitch, { toggle: toggleMute }] = useBoolean(false)

  const [volumeSlider, setVolumeSlider] = useState<number>(-1)
  if (volumeSlider === -1) setVolumeSlider(parseFloat(localStorage.getItem('volume') ?? '1'))

  const onClickMute = () => {
    console.log(volumeSlider)
    const appVolume = !MuteSwitch ? 0 : volumeSlider
    sessionStorage.setItem('appVolume', `${appVolume}`)
    toggleMute()
  }

  const onChangeVolumeSlider = (value: number) => {
    setVolumeSlider(value)
    const appVolume = MuteSwitch ? 0 : value
    sessionStorage.setItem('appVolume', `${appVolume}`)
    localStorage.setItem('volume', `${value}`)
  }

  const volumeIcon = (volume: number, mute: boolean) => {
    if (mute) return <VolumeXIcon fontSize="lg" />
    else if (volume <= 0.0) return <VolumeOffIcon fontSize="lg" />
    else if (volume <= 0.5) return <Volume1Icon fontSize="lg" />
    else return <Volume2Icon fontSize="lg" />
  }

  return (
    <Flex>

      <Toggle icon={volumeIcon(volumeSlider, MuteSwitch)} onClick={onClickMute} variant="outline" colorScheme={MuteSwitch ? 'red' : 'primary'} />
      <Box w="full" textAlign="center" paddingX={2}>
        <Slider
          value={volumeSlider} disabled={MuteSwitch} onChange={onChangeVolumeSlider}
          marginBottom={-2} step={0.01} min={0} max={1} w={40}
          filledTrackColor="primary" trackColor="gray.200"
          thumbProps={{
            visibility: 'hidden',
            _after: {
              content: '""',
              display: 'block',
              w: '2.5',
              h: '2.5',
              borderRadius: 'full',
              bg: 'primary',
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              transition: 'left 0',
              visibility: 'visible',
            },
            _disabled: { color: 'primary' },
          }}
        />
      </Box>
    </Flex>

  )
}
