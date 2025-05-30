import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState, PublicEvent, Question } from '../../models';

const initialState: RootState['events'] = {
  events: [],
  currentEvent: null,
  currentQuestion: null,
  isMobile: false,
};

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<PublicEvent[]>) => {
      state.events = action.payload;
    },
    setCurrentEvent: (state, action: PayloadAction<string | null>) => {
      state.currentEvent = action.payload;
    },
    setCurrentQuestion: (state, action: PayloadAction<string | null>) => {
      state.currentQuestion = action.payload;
    },
    addEvent: (state, action: PayloadAction<PublicEvent>) => {
      state.events.push(action.payload);
    },
    addQuestion: (state, action: PayloadAction<{ eventId: string; question: Question }>) => {
      const event = state.events.find((e: PublicEvent) => e.id === action.payload.eventId);
      if (event) {
        event.questions.push(action.payload.question);
      }
    },
    upvoteQuestion: (state, action: PayloadAction<{ eventId: string; questionId: string }>) => {
      const event = state.events.find((e: PublicEvent) => e.id === action.payload.eventId);
      if (event) {
        const question = event.questions.find((q: Question) => q.id === action.payload.questionId);
        if (question) {
          question.votes += 1;
        }
      }
    },
    setMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },
    deleteQuestion: (state, action: PayloadAction<{ eventId: string; questionId: string }>) => {
      const event = state.events.find((e: PublicEvent) => e.id === action.payload.eventId);
      if (event) {
        event.questions = event.questions.filter((q: Question) => q.id !== action.payload.questionId);
      }
    },
  },
});

export const {
  setEvents,
  setCurrentEvent,
  setCurrentQuestion,
  addEvent,
  addQuestion,
  upvoteQuestion,
  setMobile,
  deleteQuestion,
} = eventsSlice.actions;

export default eventsSlice.reducer;
