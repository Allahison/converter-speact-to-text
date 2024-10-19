import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  transcript: '',
  isListening: false,
  translatedText: '',
};

const speechSlice = createSlice({
  name: 'speech',
  initialState,
  reducers: {
    startListening: (state) => {
      state.isListening = true;
    },
    stopListening: (state) => {
      state.isListening = false;
    },
    updateTranscript: (state, action) => {
      state.transcript = action.payload;
    },
    updateTranslatedText: (state, action) => {
      state.translatedText = action.payload;
    },
    resetTranscript: (state) => {
      state.transcript = '';
      state.translatedText = '';
    },
  },
});

export const {
  startListening,
  stopListening,
  updateTranscript,
  updateTranslatedText,
  resetTranscript,
} = speechSlice.actions;

// Thunk for translating text using MyMemory API
export const translateText = (text, targetLanguage) => async (dispatch) => {
  try {
    
    const response = await axios.get(`https://api.mymemory.translated.net/get`, {
      params: {
        q: text,
        langpair: `en|${targetLanguage}`, 
      },
    });
    
    dispatch(updateTranslatedText(response.data.responseData.translatedText));
  } catch (error) {
    console.error('Translation error:', error);
  }
};

export default speechSlice.reducer;

