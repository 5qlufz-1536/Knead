import { Slider, Spacer, Tooltip, NumberInput, Select, SelectItem, Flex } from '@yamada-ui/react'
import React, { JSX, useCallback, useMemo, useState } from 'react'
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
  { name: 'f#1', value: '1.00' },
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
  { name: 'f#2', value: '2.00' },
]

export const PitchInput = ({ pitch: safePitch, onChange }: PitchInputProps): JSX.Element => {
  const floatPitchScale = useMemo(() => pitchScales.map(item => ({ ...item, float: parseFloat(item.value) })), [])
  const pitchScaleItems: SelectItem[] = useMemo(() => pitchScales.map(item => ({ label: item.name, value: item.value })), [])

  const { t } = useTranslation()

  const [internalPitch, setInternalPitch] = useState(safePitch)

  const safePitchFloat = useMemo(() => parseFloat(safePitch), [safePitch])
  const selectedPitchScale = useMemo(
    () => floatPitchScale.find(({ float: v }) => (v - 0.005 < safePitchFloat) && (safePitchFloat < v + 0.005))?.value ?? unsupportedPitch,
    [safePitchFloat, floatPitchScale],
  )

  const onChangePitchSlider = useCallback((value: number) => {
    setInternalPitch(value.toString())
    onChange(value.toString())
  }, [onChange])
  const onChangePitchInput = useCallback((value: string) => {
    setInternalPitch(value)
    if (!Number.isNaN(value) && (0.5 <= parseFloat(value) && parseFloat(value) <= 2)) {
      onChange(value)
    }
  }, [onChange, setInternalPitch])

  const onChangePitchScaleMenu = useCallback((value: string) => {
    if (value !== unsupportedPitch) {
      setInternalPitch(value.toString())
      onChange(value)
    }
  }, [onChange])

  return (
    <>
      <Tooltip label={t('pitch_input')} placement="bottom" animation="top">
        <Flex>
          <Slider
            onChange={onChangePitchSlider} value={parseFloat(safePitch)}
            w={32} h={10} step={0.01} min={0.5} max={2}
            filledTrackColor="gray.200" trackColor="gray.200"
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
            }}
          />
          <Spacer minW={3} />
          <NumberInput
            onChange={onChangePitchInput} value={internalPitch}
            w={20} placeholder="pitch" step={0.01} precision={2} min={0.5} max={2}
          />
        </Flex>
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
