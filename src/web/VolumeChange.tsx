import React from 'react'
import { Volume1Icon, Volume2Icon, VolumeOffIcon, VolumeXIcon } from '@yamada-ui/lucide'
import { Box, Flex, Slider, Toggle, useBoolean } from '@yamada-ui/react'
import { useAddDispatch, useAppSelector } from '../store/_store'
import { updateAppVolume } from '../store/fetchSlice'

export const VolumeChange = () => {
  const dispatch = useAddDispatch()

  const [MuteSwitch, { toggle: toggleMute }] = useBoolean(false)

  const volumeSlider = useAppSelector(state => state.fetch.volumeSlider)

  const onClickMute = () => {
    const mute_invert = !MuteSwitch
    dispatch(updateAppVolume({ volume: volumeSlider, mute: mute_invert }))
    toggleMute()
  }

  const onChangeVolumeSlider = (value: number) => {
    dispatch(updateAppVolume({ volume: value, mute: MuteSwitch }))
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
        <Slider value={volumeSlider} disabled={MuteSwitch} onChange={onChangeVolumeSlider} marginBottom={-2} step={0.01} min={0} max={1} w={40} filledTrackColor="primary" thumbColor="primary" trackColor="gray.200" thumbSize={2.5} thumbProps={{ _focusVisible: { boxShadow: '' }, _disabled: { color: 'primary' } }} />
      </Box>
    </Flex>

  )
}
