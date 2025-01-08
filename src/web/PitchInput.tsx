import { Slider, Spacer, Tooltip, NumberInput, Select, SelectItem, Flex } from '@yamada-ui/react'
import React, { JSX, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

type PitchInputProps = {
  pitch: string
  onChange: (pitch: string) => void
}

const unsupportedPitch = '-'
const pitchScales: Record<'label' | 'value', string>[] = [
  { label: '-', value: unsupportedPitch },
  { label: 'f#0', value: '0.5' },
  { label: 'g0', value: '0.53' },
  { label: 'g#0', value: '0.56' },
  { label: 'a0', value: '0.59' },
  { label: 'a#0', value: '0.63' },
  { label: 'b0', value: '0.67' },
  { label: 'c1', value: '0.71' },
  { label: 'c#1', value: '0.75' },
  { label: 'd1', value: '0.79' },
  { label: 'd#1', value: '0.84' },
  { label: 'e1', value: '0.89' },
  { label: 'f1', value: '0.94' },
  { label: 'f#1', value: '1' },
  { label: 'g1', value: '1.06' },
  { label: 'g#1', value: '1.12' },
  { label: 'a1', value: '1.19' },
  { label: 'a#1', value: '1.26' },
  { label: 'b1', value: '1.33' },
  { label: 'c2', value: '1.41' },
  { label: 'c#2', value: '1.5' },
  { label: 'd2', value: '1.59' },
  { label: 'd#2', value: '1.68' },
  { label: 'e2', value: '1.78' },
  { label: 'f2', value: '1.89' },
  { label: 'f#2', value: '2' },
]

export const PitchInput = ({ pitch: safePitch, onChange }: PitchInputProps): JSX.Element => {
  const floatPitchScale = useMemo(() => pitchScales.map(item => ({ ...item, float: parseFloat(item.value) })), [])

  const { t } = useTranslation()

  const [internalPitch, setInternalPitch] = useState(safePitch)

  const safePitchFloat = useMemo(() => parseFloat(safePitch), [safePitch])
  const selectedPitchScale = useMemo(
    () => floatPitchScale.find(({ float: v }) => (v - 0.005 < safePitchFloat) && (safePitchFloat < v + 0.005))?.value ?? unsupportedPitch,
    [safePitchFloat, floatPitchScale],
  )
  const pitchScaleItems: SelectItem[] = useMemo(
    () => {
      const rv = selectedPitchScale !== unsupportedPitch
        ? pitchScales.filter(item => item.value !== unsupportedPitch)
        : pitchScales
      return rv.map(v => ({ label: [t(v.label), '-', parseFloat(v.value).toFixed(2).toString()].join(' '), value: v.value }))
    },
    [selectedPitchScale, t],
  )

  const onChangePitchSlider = useCallback((value: number) => {
    setInternalPitch(value.toString())
    onChange(value.toString())
  }, [onChange])
  const onChangePitchInput = useCallback((value: string) => {
    const pitch = parseFloat(value).toString()
    setInternalPitch(pitch)
    if (!Number.isNaN(pitch) && (0.5 <= parseFloat(pitch) && parseFloat(pitch) <= 2)) {
      onChange(pitch)
    }
  }, [onChange, setInternalPitch])

  const onChangePitchScaleMenu = useCallback((value: string) => {
    if (value !== unsupportedPitch) {
      setInternalPitch(value.toString())
      onChange(value)
    }
  }, [onChange])

  const style = document.getElementById('pitchScaleItems')?.lastElementChild
  if (style?.innerHTML) style.innerHTML = [t(pitchScales.find(v => v.value == selectedPitchScale)?.label ?? ''), '-', parseFloat(internalPitch).toFixed(2).toString()].join(' ')

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
          id="pitchScaleItems"
        />
      </Tooltip>
    </>
  )
}
