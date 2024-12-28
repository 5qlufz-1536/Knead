
import React, { useEffect, useRef, MouseEvent, useState, useMemo } from 'react';
import { useAddDispatch, useAppSelector } from '../store/_store';
import { Box, Button, Flex, Input, InputGroup, InputLeftElement, Rating } from "@yamada-ui/react";
import { SearchIcon } from '@yamada-ui/lucide';
import { useVirtualScroll } from "./_VirtualScroll";

export const SoundSelector = () => {

  const sounds = useAppSelector((state) => state.fetch.sound_list);
  const version = useAppSelector((state) => state.fetch.target_version);


  const items = sounds;
  const itemHeight = 50;
  const containerHeight = 500;

  const { displayingItems, handleScroll, startIndex } = useVirtualScroll({
    containerHeight,
    itemHeight,
    items,
  });


  const [previous_version, update_previous_version] = useState<string>()

  if (previous_version != version) {
    update_previous_version(version)
  }


  return (
    <>
      <InputGroup>
        <InputLeftElement>
          <SearchIcon color="gray.500" />
        </InputLeftElement>

        <Input type="tel" placeholder="Search..." />
      </InputGroup>

      <Flex marginTop={2} border={1}>
        <div
          onScroll={handleScroll}
          style={{
            width: "100%",
            height: containerHeight,
            overflowY: "scroll"
          }}
        >
          <div style={{ height: items.length * itemHeight }}>
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: "none",
                position: "relative",
                top: startIndex * itemHeight,
              }}
            >
              {displayingItems.map((item) => (
                <li
                  key={item.id}
                  style={{
                    height: itemHeight,
                    display: "flex",
                    justifyContent: "left",
                    alignItems: "center",
                  }}
                >
                  <Flex>
                    <Rating defaultValue={item.rating} />
                    {item.id}
                  </Flex>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Flex>
    </>
  );
};