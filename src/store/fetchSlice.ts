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
  selected_sound: string;
}

const initialState: State = {
  target_version: "",
  sound_list: [],
  soundRatings: {},
  selected_sound: ""
};

export const fetchSlice = createSlice({
  name: 'fetch',
  initialState,
  reducers: {

    updateTargetVersion: (
      state,
      action: PayloadAction<{ version: string; }>
    ) => {
      state.target_version = action.payload.version
    },

    updateSoundList: (
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
    },

    updateSelectedSound: (
      state,
      action: PayloadAction<{ id: string; }>
    ) => {
      state.selected_sound = action.payload.id
    },

  },
});
export default fetchSlice.reducer;
export const { updateTargetVersion, updateSoundList, updateSoundRating, updateSelectedSound } = fetchSlice.actions;