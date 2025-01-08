import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useAddDispatch, useAppSelector } from '../store/_store'
import { Box, Flex, Input, InputGroup, InputLeftElement, Spacer, Toggle, useBoolean } from '@yamada-ui/react'
import { FilterIcon, FilterXIcon, SearchIcon } from '@yamada-ui/lucide'
import { useVirtualScroll } from '../hooks/useVirtualScroll'
import { RatingStars } from './RatingStars'
import { updateSelectedSound } from '../store/fetchSlice'
import { useWindowSize } from '../hooks/useWindowSize'
import { useTranslation } from 'react-i18next'
import { VersionInfoType } from '../types/VersionInfo'

export const SoundSelector = () => {
  const dispatch = useAddDispatch()
  const { t } = useTranslation()

  const Sounds = useAppSelector(state => state.fetch.sounds)
  // const soundRatings = useAppSelector(state => state.fetch.soundRatings)
  const [soundRatings, setSoundRatings] = useState<({ [key: string]: number })>({})
  if (!Object.keys(soundRatings).some(v => v)) setSoundRatings(JSON.parse(localStorage.getItem('soundRatings') ?? '{"_":0}'))
  const [targetVersion, setTargetVersion] = useState<VersionInfoType | undefined>(undefined)
  if (targetVersion === undefined) setTargetVersion(JSON.parse(localStorage.getItem('targetVersion') ?? '{"_":0}'))
  const selectedSound = useAppSelector(state => state.fetch.selectedSound)

  const [txtFilters, setTxtFilters] = useState<string[]>([])
  const [ratingFilter, setRatingFilter] = useState(0)
  const [ratingFilterSwitch, { toggle: toggleRatingFilter }] = useBoolean(false)

  const filteredSounds = Sounds.filter(value => txtFilters.every(filter => value.id.includes(filter))).filter((value) => {
    const rate = soundRatings[value.id] ?? 0
    let result = false
    // (ratingFilterSwitch && ratingFilter ? true : true && )
    if (ratingFilterSwitch) {
      if (rate === ratingFilter) result = true
    }
    else {
      result = true
    }
    return result
  })

  const scrollRef = useRef<HTMLDivElement>(null)
  const CorrectedRatingFilter = ratingFilterSwitch ? ratingFilter : 0
  useEffect(() => scrollRef.current?.scrollTo({ top: 0 }), [txtFilters, CorrectedRatingFilter, ratingFilterSwitch, targetVersion?.raw])

  const itemHeight = 40

  useWindowSize()

  const containerHeight = scrollRef.current?.getBoundingClientRect().height || 0

  const { displayingItems, handleScroll, startIndex } = useVirtualScroll({
    containerHeight,
    itemHeight,
    items: filteredSounds,
  })

  const listBoxHeightCSS = 'calc(100vh - 391px)'

  const onChangeSearchWord = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setTxtFilters(e.target.value.split(' ')), [setTxtFilters])

  const onSelectSound = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    dispatch(updateSelectedSound({ id: e.currentTarget.id }))
  }, [dispatch])

  const onChangeRating = (id: string, rating: number) => {
    const CorrectSoundRatings = { ...soundRatings, [id]: rating }
    // 値が0のプロパティを削除
    Object.keys(soundRatings).map((v) => {
      if (CorrectSoundRatings[v] === 0 && v != '_') delete CorrectSoundRatings[v]
    })
    setSoundRatings(CorrectSoundRatings)
    localStorage.setItem('soundRatings', JSON.stringify(CorrectSoundRatings))
  }
  const items = displayingItems.map(item => (
    <li
      key={item.id}
      style={{ height: itemHeight, display: 'flex', justifyContent: 'left', alignItems: 'center' }}
    >
      <Box
        onClick={onSelectSound}
        id={item.id}
        w="full"
        maxH={itemHeight}
        style={{ transition: '0.25s all' }}
        _hover={{ background: ['blackAlpha.200', 'whiteAlpha.200'] }}
        bg=""
      >
        <Flex
          w="full"
          style={{ userSelect: 'none', transition: '0.25s all' }}
          backgroundColor={item.id == selectedSound ? ['blackAlpha.400', 'whiteAlpha.400'] : 'none'}
          paddingX={5}
          paddingY={2}
        >
          {item.id}
          <Spacer />
          <Box alignContent="center">
            <RatingStars rating={soundRatings[item.id] ?? 0} onChange={rate => onChangeRating(item.id, rate)} />
          </Box>
        </Flex>
      </Box>
    </li>
  ))

  return (
    <>
      <Flex w="full">
        <InputGroup>
          <InputLeftElement>
            <SearchIcon color="gray.500" fontSize="lg" />
          </InputLeftElement>

          <Input placeholder={t('search_sound_id')} onChange={onChangeSearchWord} />
        </InputGroup>

        <Spacer />

        <Flex paddingX={5} bg="">
          <Box alignContent="center">
            <RatingStars rating={ratingFilter} onChange={rate => setRatingFilter(rate)} />
          </Box>
        </Flex>
        {/* <Tooltip label="お気に入りフィルター" placement="bottom" animation="top"> */}
        <Toggle variant="outline" colorScheme="primary" icon={ratingFilterSwitch ? <FilterIcon fontSize="lg" /> : <FilterXIcon fontSize="lg" />} onClick={toggleRatingFilter} />
        {/* </Tooltip> */}
      </Flex>

      <Box marginTop={2} border="1px solid" borderColor="inherit" borderRadius={5} h={listBoxHeightCSS}>
        <div
          onScroll={handleScroll}
          ref={scrollRef}
          style={{ width: '100%', height: listBoxHeightCSS, overflowY: 'scroll' }}
        >
          <div style={{ height: filteredSounds.length * itemHeight }}>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', position: 'relative', top: startIndex * itemHeight }}>
              {items}
            </ul>
          </div>
        </div>
      </Box>
    </>
  )
}
