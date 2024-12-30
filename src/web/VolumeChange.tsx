import React from 'react'
import { Volume1Icon, Volume2Icon, VolumeOffIcon, VolumeXIcon } from '@yamada-ui/lucide'
import { Box, IconButton, Popover, PopoverBody, PopoverContent, PopoverHeader, PopoverTrigger, Slider, Toggle, useBoolean } from '@yamada-ui/react'
import { useAddDispatch, useAppSelector } from '../store/_store'
import { updateAppVolume } from '../store/fetchSlice'

export const VolumeChange = () => {
  const dispatch = useAddDispatch()

  const [MuteSwitch, { toggle: toggleMute }] = useBoolean(false)

  const volumeSlider = useAppSelector(state => state.fetch.volumeSlider)

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
    <Popover animation="top" closeOnButton={false} gutter={0}>
      <PopoverTrigger>
        <IconButton icon={volumeIcon(volumeSlider, MuteSwitch)} variant="outline" />
      </PopoverTrigger>

      <PopoverContent w={10}>
        <PopoverHeader>
          <Toggle icon={<VolumeXIcon fontSize="lg" />} onClick={toggleMute} variant="outline" />
        </PopoverHeader>
        <PopoverBody>
          <Box w="full" textAlign="center" paddingY={2}>
            <Slider value={volumeSlider} disabled={MuteSwitch} onChange={onChangeVolumeSlider} h="xs" orientation="vertical" marginTop={2} step={0.01} min={0} max={1} filledTrackColor="primary" thumbColor="primary" trackColor="gray.200" thumbSize={2.5} thumbProps={{ _focusVisible: { boxShadow: '' }, _disabled: { color: 'primary' } }} />
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>

  )
}
