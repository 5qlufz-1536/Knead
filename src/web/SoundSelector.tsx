
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAddDispatch, useAppSelector } from '../store/_store';
import { Box, Flex, Input, InputGroup, InputLeftElement, Spacer, Toggle, useBoolean } from "@yamada-ui/react";
import { FilterIcon, FilterXIcon, SearchIcon } from '@yamada-ui/lucide';
import { useVirtualScroll } from "./hooks/VirtualScroll";
import { RatingStars } from "./RatingStars"
import { updateSoundRating } from "../store/fetchSlice";

export const SoundSelector = () => {
  const dispatch = useAddDispatch();

  const sounds = useAppSelector(state => state.fetch.sound_list);
  const soundRatings = useAppSelector(state => state.fetch.soundRatings);
  const target_version = useAppSelector(state => state.fetch.target_version);

  const [txtFilters, setTxtFilters] = useState<string[]>([])
  const [ratingFilter, setRatingFilter] = useState(0)
  const [ratingFilterSwitch, { toggle: toggleRatingFilter }] = useBoolean(false)

  const filteredSounds = sounds.filter(value => txtFilters.every(filter => value.id.includes(filter))).filter(value => {

    const rate = soundRatings[value.id] ?? 0
    let result = false
    // (ratingFilterSwitch && ratingFilter ? true : true && )
    if (ratingFilterSwitch) {
      if (rate === ratingFilter) result = true
    } else {
      result = true
    }
    return result

  });


  const itemHeight = 40;
  const containerHeight = 400;


  const { displayingItems, handleScroll, startIndex } = useVirtualScroll({
    containerHeight,
    itemHeight,
    items: filteredSounds,
  });

  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => scrollRef.current?.scrollTo({ top: 0, }), [txtFilters, ratingFilter, ratingFilterSwitch, target_version])

  const onChangeSearchWord = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setTxtFilters(e.target.value.split(' ')), [setTxtFilters])

  const onChangeRating = (id: string, rating: number) => {
    dispatch(updateSoundRating({ soundRatings: { ...soundRatings, [id]: rating } }))
  }
  const items = displayingItems.map(item => (
    <li
      key={item.id}
      style={{ height: itemHeight, display: "flex", justifyContent: "left", alignItems: "center" }}
    >
      <Box
        as="button" w="full" maxH={itemHeight} style={{ transition: "0.5s all" }}
        _nativeHover={{ background: ['blackAlpha.200', 'whiteAlpha.200'] }} paddingX={5} paddingY={2} bg=""
      >
        <Flex w="full">
          {item.id}
          <Spacer />
          <RatingStars rating={soundRatings[item.id] ?? 0} onChange={rate => onChangeRating(item.id, rate)} />
        </Flex>
      </Box>
    </li>
  ))

  return (
    <>
      <Flex w="full" >
        <InputGroup>
          <InputLeftElement>
            <SearchIcon color="gray.500" />
          </InputLeftElement>

          <Input placeholder="Search..." onChange={onChangeSearchWord} />
        </InputGroup>

        <Spacer />

        <Flex paddingX={5} bg="">
          <Box alignContent="center">
            <RatingStars rating={ratingFilter} onChange={rate => setRatingFilter(rate)} />
          </Box>
        </Flex>
        <Toggle variant="outline" colorScheme="success" icon={ratingFilterSwitch ? <FilterIcon /> : <FilterXIcon />} onClick={toggleRatingFilter} />
      </Flex>


      <Box marginTop={2} border="1px solid" borderColor="inherit" boxShadow="md" borderRadius={5}>
        <div
          onScroll={handleScroll}
          ref={scrollRef}
          style={{ width: "100%", height: containerHeight, overflowY: "scroll" }}
        >
          <div style={{ height: filteredSounds.length * itemHeight }}>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", position: "relative", top: startIndex * itemHeight }}>
              {items}
            </ul>
          </div>
        </div>
      </Box>
    </>
  );
};