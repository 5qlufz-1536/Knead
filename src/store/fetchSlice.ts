import { createSlice, PayloadAction } from '@reduxjs/toolkit';



export interface Sound {
  id: string;
  sounds: SoundName[];
  rating: number;
}

export interface SoundName {
  hash: string;
  volume: number;
  pitch: number;
}


interface State {
  target_version: string;
  sound_list: Sound[];
}

const initialState: State = {
  target_version: "",
  sound_list: []
};

export const fetchSlice = createSlice({
  name: 'fetch',
  initialState,
  reducers: {

    targetVersion: (
      state,
      action: PayloadAction<{ version: string; }>
    ) => {
      state.target_version = action.payload.version
    },

    soundList: (
      state,
      action: PayloadAction<{ sounds: Sound[]; }>
    ) => {
      state.sound_list = action.payload.sounds;
    },

  },
});
export default fetchSlice.reducer;
export const { targetVersion, soundList } = fetchSlice.actions;