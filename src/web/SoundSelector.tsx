
import React, { useEffect, useRef, MouseEvent } from 'react';
import { useAddDispatch, useAppSelector } from '../store/_store';
import { soundList } from '../store/fetchSlice';
import { Button, Input, InputGroup, InputLeftElement, List, ListItem, Rating, ScrollArea } from "@yamada-ui/react";
import { SearchIcon } from '@yamada-ui/lucide';

const { myAPI } = window;

export const SoundSelector = () => {
  const name = useRef<string>('');
  const age = useRef<number>(0);
  const dispatch = useAddDispatch();
  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // dispatch(soundList({ id: name.current, rating: age.current }));
  };

  const sounds = useAppSelector((state) => state.fetch.sound_list);
  const version = useAppSelector((state) => state.fetch.target_version);

  // console.log(sounds)

  return (
    <>
      <InputGroup>
        <InputLeftElement>
          <SearchIcon color="gray.500" />
        </InputLeftElement>

        <Input type="tel" placeholder="Search..." />
      </InputGroup>
      <ScrollArea h="lg" marginTop={2} padding={2}>
        <List>
          {sounds.map((sound) => (
            <ListItem as="button" key={sound.id}>
              {sound.id}
              {/* <Rating defaultValue={sound.rating}/> */}
            </ListItem>
          ))}
        </List>
      </ScrollArea>

    </>
  );
};