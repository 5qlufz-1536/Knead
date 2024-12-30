import { Volume2Icon, VolumeXIcon } from '@yamada-ui/lucide';
import { Box, IconButton, Popover, PopoverBody, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, Slider, Toggle, useBoolean } from '@yamada-ui/react';
import { PiSelectionBold } from 'react-icons/pi';
import { useAddDispatch, useAppSelector } from '../store/_store';
import { updateAppVolume } from '../store/fetchSlice';


export const VolumeChange = () => {
  const dispatch = useAddDispatch();

  const [MuteSwitch, { toggle: toggleMute }] = useBoolean(false)

  const app_volume = useAppSelector(state => state.fetch.app_volume);

  const changeVolumeSlider = (e: number) => {
    dispatch(updateAppVolume({ volume: e }))
  }

  return (
    <Popover animation="top" closeOnButton={false} gutter={0}>
      <PopoverTrigger>
        <IconButton icon={<Volume2Icon fontSize="lg" />} variant="outline" />
      </PopoverTrigger>

      <PopoverContent w={10}>
        <PopoverHeader>
          <Toggle icon={<VolumeXIcon fontSize="lg"/>} onClick={toggleMute} />
        </PopoverHeader>
        <PopoverBody>
          <Box w="full" textAlign="center" paddingY={2} >
            <Slider h="xs" orientation="vertical" marginTop={2} step={0.01} value={app_volume} disabled={MuteSwitch} onChange={changeVolumeSlider} min={-1} max={0} filledTrackColor="primary" thumbColor="primary" trackColor="gray.200" thumbSize={2.5} thumbProps={{ _focusVisible: { boxShadow: "" } }} />
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>


  );
};