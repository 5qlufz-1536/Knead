import { Slider, Spacer, Tooltip, NumberInput, Select, SelectItem } from '@yamada-ui/react'
import React, { JSX, useCallback, useMemo } from 'react'
import { t } from 'i18next'
import { useTranslation } from 'react-i18next'

type PitchInputProps = {
  pitch: string
  onChange: (pitch: string) => void
}

type PitchScale = {
  name: string
  value: string
}
const unsupportedPitch = '-'
const pitchScales: PitchScale[] = [
  { name: '-', value: unsupportedPitch },
  { name: 'f#0', value: '0.5' },
  { name: 'g0', value: '0.53' },
  { name: 'g#0', value: '0.56' },
  { name: 'a0', value: '0.59' },
  { name: 'a#0', value: '0.63' },
  { name: 'b0', value: '0.67' },
  { name: 'c1', value: '0.71' },
  { name: 'c#1', value: '0.75' },
  { name: 'd1', value: '0.79' },
  { name: 'd#1', value: '0.84' },
  { name: 'e1', value: '0.89' },
  { name: 'f1', value: '0.94' },
  { name: 'f#1', value: '1' },
  { name: 'g1', value: '1.06' },
  { name: 'g#1', value: '1.12' },
  { name: 'a1', value: '1.19' },
  { name: 'a#1', value: '1.26' },
  { name: 'b1', value: '1.33' },
  { name: 'c2', value: '1.41' },
  { name: 'c#2', value: '1.5' },
  { name: 'd2', value: '1.59' },
  { name: 'd#2', value: '1.68' },
  { name: 'e2', value: '1.78' },
  { name: 'f2', value: '1.89' },
  { name: 'f#2', value: '2' },
]

export const PitchInput = ({ pitch, onChange }: PitchInputProps): JSX.Element => {
  const pitchScaleItems: SelectItem[] = pitchScales.map(item => ({ label: t(item.name), value: item.value }))

  const selectedPitchScale = useMemo(() => pitchScales.find(item => item.value === pitch)?.value ?? unsupportedPitch, [pitch])

  const onChangePitchSlider = useCallback((value: number) => onChange(value.toString()), [onChange])
  const onChangePitchInput = useCallback((value: string) => onChange(value), [onChange])
  const onChangePitchScaleMenu = useCallback((value: string) => {
    if (value !== unsupportedPitch) {
      onChange(value)
    }
  }, [onChange])
  return (
    <>
      <Slider
        onChange={onChangePitchSlider} value={parseFloat(pitch)}
        w={32} h={10} step={0.01} min={0.5} max={2}
        filledTrackColor="gray.200" thumbColor="primary" trackColor="gray.200"
        thumbSize={2.5} thumbProps={{ _focusVisible: { boxShadow: '' } }}
      />
      <Spacer maxW={3} />
      <Tooltip label={t('pitch_input')} placement="bottom" animation="top">
        <NumberInput
          onChange={onChangePitchInput} value={pitch}
          w={20} placeholder="pitch" step={0.1} precision={2} min={0.5} max={2}
        />
      </Tooltip>
      <Spacer maxW={1} />
      <Tooltip label={t('pitch_scale')} placement="bottom" animation="top">
        <Select
          onChange={onChangePitchScaleMenu} items={pitchScaleItems} value={selectedPitchScale}
          placeholderInOptions={false} w={32} animation="bottom" listProps={{ padding: 0, margin: 0 }}
        />
      </Tooltip>
    </>
  )
}
