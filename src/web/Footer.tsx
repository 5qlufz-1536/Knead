import { Box, Flex, IconButton, Input, NumberInput, Select, SelectItem, Separator, Slider, Spacer, Text, Toggle, Tooltip, useBoolean, useClipboard } from '@yamada-ui/react'
import { FaPlay, FaPause, FaArrowRotateLeft } from 'react-icons/fa6'
import { CheckIcon, CopyIcon, SlashIcon, MegaphoneOffIcon } from '@yamada-ui/lucide'
import { PiTildeBold, PiCaretUpBold, PiSelectionBold } from 'react-icons/pi'
import { useAddDispatch, useAppSelector } from '../store/_store'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SoundName, updateSelectedSound } from '../store/fetchSlice'
import { isAboveVersion } from '../types/VersionInfo'
import { useAudioPlay } from './hooks/useAudioPlay'
import { useTranslation } from 'react-i18next'

const { myAPI } = window

type PitchScale = {
  name: string
  value: number
}

export const Footer = () => {
  const { t } = useTranslation()
  const dispatch = useAddDispatch()

  const PlaySourceItems: SelectItem[] = [

    { label: 'ambient', value: 'ambient' },
    { label: 'block', value: 'block' },
    { label: 'hostile', value: 'hostile' },
    { label: 'music', value: 'music' },
    { label: 'neutral', value: 'neutral' },
    { label: 'player', value: 'player' },
    { label: 'record', value: 'record' },
    { label: 'voice', value: 'voice' },
    { label: 'weather', value: 'weather' },
    {
      label: t('not_recommended'), items: [
        { label: 'master', value: 'master' },
      ],
    },
  ]

  const PitchScale: PitchScale[] = [
    { name: 'f#0', value: 0.5 },
    { name: 'g0', value: 0.53 },
    { name: 'g#0', value: 0.56 },
    { name: 'a0', value: 0.59 },
    { name: 'a#0', value: 0.63 },
    { name: 'b0', value: 0.67 },
    { name: 'c1', value: 0.71 },
    { name: 'c#1', value: 0.75 },
    { name: 'd1', value: 0.79 },
    { name: 'd#1', value: 0.84 },
    { name: 'e1', value: 0.89 },
    { name: 'f1', value: 0.94 },
    { name: 'f#1', value: 1.0 },
    { name: 'g1', value: 1.06 },
    { name: 'g#1', value: 1.12 },
    { name: 'a1', value: 1.19 },
    { name: 'a#1', value: 1.26 },
    { name: 'b1', value: 1.33 },
    { name: 'c2', value: 1.41 },
    { name: 'c#2', value: 1.5 },
    { name: 'd2', value: 1.59 },
    { name: 'd#2', value: 1.68 },
    { name: 'e2', value: 1.78 },
    { name: 'f2', value: 1.89 },
    { name: 'f#2', value: 2.0 },
  ]

  const PitchScaleItems: SelectItem[] = PitchScale.map((item) => {
    return { label: t(item.name), value: item.name, id: item.name }
  })

  const timeToString = (sec: number, max_sec: number | undefined) => {
    const max_hour_check = max_sec ? Math.floor((max_sec / 60) / 60) : 0
    const hour_num = Math.floor((sec / 60) / 60)

    return (max_hour_check < 1 ? '' : ('0' + hour_num).slice(-2) + ':') + ('0' + Math.floor(sec / 60) % 60).slice(-2) + ':' + ('0' + Math.floor(sec % 60)).slice(-2)
  }

  const { onCopy, hasCopied } = useClipboard()

  // スラッシュスイッチ
  const [SlashSwitch, { toggle: toggleSlash }] = useBoolean(false)

  // サウンドを流すターゲット(masterとか)
  const [PlaySource, setPlaySource] = useState('master')
  const [PlaySourceDisable, { on: onPlaySourceDisable, off: offPlaySourceDisable }] = useBoolean(false)

  // ピッチ関係
  const [Pitch, setPitch] = useState(1)
  const [SelectedPitchScale, setSelectedPitchScale] = useState('f#1')
  const onChangePitchSlider = (value: number) => {
    setPitch(value)

    const scale: string = PitchScale.find(e => e.value == value)?.name ?? ''
    if (scale != '') setSelectedPitchScale(scale)
  }
  const onChangePitchInput = (e: string, value: number) => {
    setPitch(value)

    const scale: string = PitchScale.find(e => e.value == value)?.name ?? ''
    if (scale != '') setSelectedPitchScale(scale)
  }
  const onChangePitchScaleMenu = (scale: string) => {
    setSelectedPitchScale(scale)

    const pitch: number = PitchScale.find(e => e.name == scale)?.value ?? 1
    setPitch(pitch)
  }

  // 座標指定関系
  const [Coordinate, setCoordinate] = useState('')
  const [CoordinateError, { on: onCoordinateError, off: offCoordinateError }] = useBoolean(false)
  const onChangeCoordinate = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const str = e.target.value

    // 条件に応じてエラー表示を行う
    // if (/([\^\~]?[\d]{1,})*/g.test(str) || str === "") offCoordinateError()
    // else onCoordinateError()

    setCoordinate(e.target.value)
  }, [setCoordinate])
  const onClickTilde = () => {
    const splitCoordinate: number[] = Coordinate.replaceAll('~', '').replaceAll('^', '').split(' ').map(v => v == '' ? 0 : Number(v))
    const returnCoordinate: string[] = ['~']
    for (let i = 0; i <= 2; i++) {
      returnCoordinate.push((typeof splitCoordinate[i] === 'number' && splitCoordinate[i] != 0 && splitCoordinate[i].toString() != 'NaN') ? splitCoordinate[i].toString() : '')
      if (i < 2) returnCoordinate.push(' ~')
    }
    setCoordinate(returnCoordinate.join(''))
  }
  const onClickCaret = () => {
    const splitCoordinate: number[] = Coordinate.replaceAll('~', '').replaceAll('^', '').split(' ').map(v => v == '' ? 0 : Number(v))
    const returnCoordinate: string[] = ['^']
    for (let i = 0; i <= 2; i++) {
      returnCoordinate.push((typeof splitCoordinate[i] === 'number' && splitCoordinate[i] != 0 && splitCoordinate[i].toString() != 'NaN') ? splitCoordinate[i].toString() : '')
      if (i < 2) returnCoordinate.push(' ^')
    }
    setCoordinate(returnCoordinate.join(''))
  }
  const onClickRemoveSymbol = () => {
    const splitCoordinate: number[] = Coordinate.replaceAll('~', '').replaceAll('^', '').split(' ').map(v => v == '' ? NaN : Number(v))
    const HasIndexes: boolean = splitCoordinate.filter(v => v.toString() != 'NaN').length > 0
    const returnCoordinate: string[] = ['']
    for (let i = 0; i <= 2; i++) {
      returnCoordinate.push((typeof splitCoordinate[i] === 'number' && splitCoordinate[i] != 0 && splitCoordinate[i].toString() != 'NaN') ? splitCoordinate[i].toString() : (HasIndexes ? '0' : ''))
      if (HasIndexes && i < 2) returnCoordinate.push(' ')
    }
    setCoordinate(returnCoordinate.join(''))
  }

  // セレクター関系
  const [Selector, setSelector] = useState('@a')
  const [SelectorError, { on: onSelectorError, off: offSelectorError }] = useBoolean(false)
  const [SelectorX0, { toggle: toggleSelectorX0 }] = useBoolean(false)
  const onChangeSelector = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // スペースを削除した文字列を入手
    // const selector = e.target.value.replaceAll(" ", "")

    // コンマでスプリット > イコールでスプリット

    // offSelectorError()
    setSelector(e.target.value)
  }, [setSelector])

  // ボリューム(生成)関係
  const [MaxVolume, setMaxVolume] = useState(1)
  const [MinVolume, setMinVolume] = useState(0)
  const onChangeMaxVolumeInput = (e: string, value: number) => {
    setMaxVolume(value)
  }
  const onChangeMinVolumeInput = (e: string, value: number) => {
    setMinVolume(value)
  }

  const sounds = useAppSelector(state => state.fetch.sounds)

  const selectedSound = useAppSelector(state => state.fetch.selectedSound)
  const soundSelectDetector = useAppSelector(state => state.fetch.soundSelectDetector)

  const targetVersion = useAppSelector(state => state.fetch.targetVersion)

  const appVolume = useAppSelector(state => state.fetch.appVolume)

  const mc_24w09a_above = isAboveVersion(targetVersion, { kind: 'release', raw: '', major: 1, minor: 20, patch: 5 })
    ? true
    : isAboveVersion(targetVersion, { kind: 'release-candidate', raw: '', major: 1, minor: 20, patch: 5, releaseNumber: 1 })
      ? true
      : isAboveVersion(targetVersion, { kind: 'pre-release', raw: '', major: 1, minor: 20, patch: 5, releaseNumber: 1 })
        ? true
        : isAboveVersion(targetVersion, { kind: 'snapshot', raw: '', year: 24, releaseNumber: 9, letter: '' })

  const mc_17w45a_above = isAboveVersion(targetVersion, { kind: 'release', raw: '', major: 1, minor: 13, patch: 0 })
    ? true
    : isAboveVersion(targetVersion, { kind: 'release-candidate', raw: '', major: 1, minor: 13, patch: 0, releaseNumber: 1 })
      ? true
      : isAboveVersion(targetVersion, { kind: 'pre-release', raw: '', major: 1, minor: 13, patch: 0, releaseNumber: 1 })
        ? true
        : isAboveVersion(targetVersion, { kind: 'snapshot', raw: '', year: 17, releaseNumber: 45, letter: '' })

  const mc_15w49a_above = isAboveVersion(targetVersion, { kind: 'release', raw: '', major: 1, minor: 9, patch: 0 })
    ? true
    : isAboveVersion(targetVersion, { kind: 'release-candidate', raw: '', major: 1, minor: 9, patch: 0, releaseNumber: 1 })
      ? true
      : isAboveVersion(targetVersion, { kind: 'pre-release', raw: '', major: 1, minor: 9, patch: 0, releaseNumber: 1 })
        ? true
        : isAboveVersion(targetVersion, { kind: 'snapshot', raw: '', year: 15, releaseNumber: 49, letter: '' })

  // コマンド生成
  // 1.20.5(24w09a)以降は<source>と<selector>を省略できるようになった
  // 1.13(17w45a)以降は<selector>の記述方式が変更された
  // 1.9(15w49a)以降は<source>が必要になった
  const command = useMemo(() => {
    const splitCoordinate: number[] = Coordinate.replaceAll('~', '').replaceAll('^', '').split(' ').map(v => v == '' ? NaN : Number(v))
    const HasIndexes: boolean = splitCoordinate.filter(v => v.toString() != 'NaN').length > 0
    const returnCoordinate: string[] = ['']
    for (let i = 0; i <= 2; i++) {
      returnCoordinate.push((typeof splitCoordinate[i] === 'number' && splitCoordinate[i] != 0 && splitCoordinate[i].toString() != 'NaN') ? splitCoordinate[i].toString() : (HasIndexes ? '0' : ''))
      if (HasIndexes && i < 2) returnCoordinate.push(' ')
    }
    const CorrectedCoordinate = Coordinate.includes('~') ? Coordinate : Coordinate.includes('^') ? Coordinate : returnCoordinate.join('')

    return selectedSound != ''
      ? (
          [
            (SlashSwitch ? '/' : '') + 'playsound',
            selectedSound,
            (!mc_15w49a_above ? undefined : ((mc_24w09a_above && PlaySource == 'master' && Selector == '@s' && Coordinate == '' && MaxVolume == 1 && Pitch == 1 && MinVolume == 0) ? '' : PlaySource)),
            ((mc_24w09a_above && Selector == '@s' && Coordinate == '' && MaxVolume == 1 && Pitch == 1 && MinVolume == 0) ? '' : Selector),
            ((CorrectedCoordinate == '' && MaxVolume == 1 && Pitch == 1 && MinVolume == 0) ? '' : (CorrectedCoordinate == '' ? '~ ~ ~' : CorrectedCoordinate)),
            ((MaxVolume == 1 && Pitch == 1 && MinVolume == 0) ? '' : MaxVolume),
            ((Pitch == 1 && MinVolume == 0) ? '' : Pitch),
            (MinVolume == 0 ? '' : MinVolume),
          ].join(' ')
        )
      : ''
  }, [Coordinate, selectedSound, SlashSwitch, mc_15w49a_above, mc_24w09a_above, PlaySource, Selector, MaxVolume, Pitch, MinVolume])

  const isPlaying = false

  const AudioController = useAudioPlay()

  useEffect(() => {
    (async () => {
      const targetSound = sounds.filter(sound => sound.id == selectedSound)[0]
      const targetHashes = targetSound?.sounds ?? []
      const sound = targetHashes[Math.floor(Math.random() * targetHashes.length)]
      try {
        const hash = await myAPI.get_mcSoundHash(sound?.hash ?? '')
        // AudioController.commands.setSound(selectedSound, hash)
        // AudioController.commands.play()
      }
      catch (e: unknown) {
        alert(e)
      }
    })()
  }, [AudioController.commands, selectedSound, sounds])

  // 選択バージョンに変化があったとき
  useEffect(() => {
    // 選択しているサウンドを削除
    dispatch(updateSelectedSound({ id: '' }))
    // 一定バージョン以上ですよフラグによってSourceの選択を無効化する
    if (mc_15w49a_above) offPlaySourceDisable()
    else onPlaySourceDisable()
  }, [dispatch, mc_15w49a_above, offPlaySourceDisable, onPlaySourceDisable, targetVersion])

  return (
    <>
      <footer className="fixed_bottom">
        <Box w="full" bg="footerBackground" padding={2} borderTop="1px solid" borderColor="inherit" style={{ userSelect: 'none' }}>

          <Box alignContent="center" paddingX={1}>
            <Slider step={0.01} defaultValue={0} min={0} max={100} filledTrackColor="primary" thumbColor="primary" trackColor="gray.200" thumbSize={2.5} thumbProps={{ _focusVisible: { boxShadow: '' } }} />
          </Box>

          <Flex w="full" marginTop={2}>
            <IconButton icon={<FaArrowRotateLeft size={20} />} variant="ghost" />
            <Spacer maxW={1} />
            <IconButton icon={isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />} variant="ghost" />
            <Spacer maxW={1} />
            <Text alignContent="center" paddingX={1} style={{ userSelect: 'none' }} fontSize="lg">
              {timeToString(0, 100)}
              {' '}
              /
              {' '}
              {timeToString(100, 100)}
            </Text>
            <Spacer />
            <Tooltip label={t('pitch_slider')} placement="bottom" animation="top">
              <Box>
                <Slider onChange={onChangePitchSlider} value={Pitch} w={32} step={0.01} min={0.5} max={2} filledTrackColor="gray.200" thumbColor="primary" trackColor="gray.200" thumbSize={2.5} thumbProps={{ _focusVisible: { boxShadow: '' } }} />
              </Box>
            </Tooltip>
            <Spacer maxW={3} />
            <Tooltip label={t('pitch_input')} placement="bottom" animation="top">
              <NumberInput onChange={onChangePitchInput} value={Pitch} w={20} placeholder="pitch" step={0.1} precision={2} min={0.5} max={2} />
            </Tooltip>
            <Spacer maxW={1} />
            <Tooltip label={t('pitch_scale')} placement="bottom" animation="top">
              <Select onChange={onChangePitchScaleMenu} items={PitchScaleItems} value={SelectedPitchScale} placeholderInOptions={false} w={32} animation="bottom" listProps={{ padding: 0, margin: 0 }} />
            </Tooltip>
          </Flex>

          <Flex w="full" marginTop={1}>
            <Tooltip label={t('add_slash')} placement="bottom" animation="top">
              <Toggle variant="outline" colorScheme="primary" icon={<SlashIcon fontSize="lg" />} onClick={toggleSlash} />
            </Tooltip>
            <Spacer maxW={1} />
            <Tooltip label={t('play_source')} placement="bottom" animation="top">
              <Select disabled={PlaySourceDisable} items={PlaySourceItems} onChange={setPlaySource} defaultValue="master" placeholderInOptions={false} w={32} animation="bottom" listProps={{ padding: 0, margin: 0 }} />
            </Tooltip>
            <Spacer />
            <Tooltip label={t('max_volume')} placement="bottom" animation="top">
              <NumberInput onChange={onChangeMaxVolumeInput} w={32} defaultValue={1.0} precision={2} min={0.0} step={0.1} />
            </Tooltip>
            <Spacer maxW={1} />
            <Tooltip label={t('min_volume')} placement="bottom" animation="top">
              <NumberInput onChange={onChangeMinVolumeInput} w={32} defaultValue={0.0} precision={2} min={0.0} max={1.0} step={0.1} />
            </Tooltip>
          </Flex>

          <Flex w="full" marginTop={1}>
            <Tooltip label={t('coordinate')} placement="bottom" animation="top">
              <Input value={Coordinate} onChange={onChangeCoordinate} invalid={CoordinateError} w="calc(full - xs)" placeholder="Coordinate" />
            </Tooltip>
            <Spacer maxW={10} />
            <Tooltip label={t('tilde_symbol')} placement="bottom" animation="top">
              <Box border="1px solid" borderColor="inherit" borderRadius={5}>
                <IconButton onClick={onClickTilde} icon={<PiTildeBold size={20} />} variant="ghost" />
              </Box>
            </Tooltip>
            <Spacer maxW={1} />
            <Tooltip label={t('caret_symbol')} placement="bottom" animation="top">
              <Box border="1px solid" borderColor="inherit" borderRadius={5}>
                <IconButton onClick={onClickCaret} icon={<PiCaretUpBold size={20} />} variant="ghost" />
              </Box>
            </Tooltip>
            <Spacer maxW={1} />
            <Tooltip label={t('symbol_clear')} placement="bottom" animation="top">
              <Box border="1px solid" borderColor="inherit" borderRadius={5}>
                <IconButton onClick={onClickRemoveSymbol} icon={<PiSelectionBold size={20} />} variant="ghost" />
              </Box>
            </Tooltip>
          </Flex>

          <Flex w="full" marginTop={1}>
            <Tooltip label={t('selector')} placement="bottom" animation="top">
              <Input onChange={onChangeSelector} invalid={SelectorError} defaultValue="@a" w="calc(full - xs)" placeholder="Selector" />
            </Tooltip>
            <Spacer maxW={10} />
            <Tooltip label={t('this_dimension_only')} placement="bottom" animation="top" maxW="full">
              <Toggle disabled onClick={toggleSelectorX0} variant="outline" colorScheme="primary" defaultSelected icon={<MegaphoneOffIcon fontSize="lg" />} />
            </Tooltip>
          </Flex>

          <Box w="full" marginTop={1} border="1px solid" borderColor="bg" borderRadius={5}>
            <Flex>
              <Box alignContent="center" paddingX={3} style={{ userSelect: 'none' }}>{command}</Box>
              <Spacer />
              <Box><Separator orientation="vertical" borderColor="bg" /></Box>
              <Tooltip label={hasCopied ? 'Copied!' : 'Copy'} placement="bottom" animation="top">
                <IconButton icon={hasCopied ? <CheckIcon color="success" marginX={6} /> : <CopyIcon marginX={6} />} onClick={() => onCopy(command)} variant="ghost" borderLeftRadius={0} borderRightRadius={2} />
              </Tooltip>
            </Flex>
          </Box>

        </Box>
      </footer>
    </>
  )
}
