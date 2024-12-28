import { createSlice, PayloadAction } from '@reduxjs/toolkit';



export interface Sound {
  id: string;
  sounds: SoundName[];
}

export interface SoundName {
  hash: string;
  pitch: number;
}


interface State {
  target_version: string;
  sound_list: Sound[];
  soundRatings: { [key: string]: number; };
}

const initialState: State = {
  target_version: "",
  sound_list: [],
  soundRatings: {}
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

    updateSoundRating: (
      state,
      action: PayloadAction<{ soundRatings: { [key: string]: number; }; }>
    ) => {
      state.soundRatings = action.payload.soundRatings;
    }

  },
});
export default fetchSlice.reducer;
export const { targetVersion, soundList, updateSoundRating } = fetchSlice.actions;