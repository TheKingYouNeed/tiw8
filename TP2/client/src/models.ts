export interface PublicEvent {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Question {
  id: string;
  text: string;
  content: string;
  votes: number;
  author: string;
  color?: string;
  position?: {
    x: number;
    y: number;
  };
  size?: {
    width: number;
    height: number;
  };
}

export interface RootState {
  events: {
    events: PublicEvent[];
    currentEvent: string | null;
    currentQuestion: string | null;
    isMobile: boolean;
  };
}

export interface AppState {
  events: PublicEvent[];
  currentEvent: string | null;
  isFullscreen: boolean;
  isMobile: boolean;
}
