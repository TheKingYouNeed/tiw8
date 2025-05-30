import type { Middleware, MiddlewareAPI } from 'redux';
import { io, Socket } from 'socket.io-client';
import type { RootState } from '..';
import { addEvent, addQuestion, setEvents, upvoteQuestion, setCurrentEvent, setCurrentQuestion, deleteQuestion } from '../slices/eventsSlice';
import type { NavigateFunction } from 'react-router-dom';

// Utiliser l'adresse IP du serveur ou l'adresse de l'hôte actuel
const getServerUrl = () => {
  // Récupérer l'hôte actuel (IP ou nom de domaine)
  const currentHost = window.location.hostname;
  // Utiliser le port 3000 pour le serveur
  return `http://${currentHost}:3000`;
};

const SOCKET_URL = getServerUrl();

// Navigation helper for use with socket actions
let navigate: NavigateFunction | null = null;

// Socket instance (singleton)
let socketInstance: Socket | null = null;

// Throttle configuration
const THROTTLE_DELAY = 300; // ms
let lastActionTime = 0;

export const setNavigate = (nav: NavigateFunction) => {
  navigate = nav;
};

interface ActionWithType {
  type: string;
  payload?: any;
  meta?: {
    fromSocket?: boolean;
    [key: string]: any;
  };
}

// Define a type for the socket middleware to avoid circular reference
type SocketMiddlewareType = Middleware<{}, RootState>;

export const socketMiddleware: SocketMiddlewareType = 
  (store: MiddlewareAPI<any, RootState>) => {
    // Initialiser la socket uniquement si elle n'existe pas déjà
    const getSocket = (): Socket => {
      if (!socketInstance) {
        console.log('Initializing new socket connection');
        socketInstance = io(SOCKET_URL, {
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          timeout: 20000,
          transports: ['websocket', 'polling'] // Préférer WebSocket pour de meilleures performances
        });

        socketInstance.on('connect', () => {
          console.log('Connected to server');
        });

        socketInstance.on('events', (events) => {
          // Ajouter un flag pour indiquer que cette action vient du serveur
          store.dispatch(setEvents(events));
        });

        socketInstance.on('action', (actionFromSocket: ActionWithType) => {
          console.log('Received action from socket:', actionFromSocket);
          
          // Traitement des actions reçues du serveur
          switch (actionFromSocket.type) {
            case 'events/addEvent':
              store.dispatch({ 
                ...addEvent(actionFromSocket.payload),
                meta: { fromSocket: true }
              });
              break;
            case 'events/addQuestion':
              store.dispatch({ 
                ...addQuestion(actionFromSocket.payload),
                meta: { fromSocket: true }
              });
              break;
            case 'events/upvoteQuestion':
              store.dispatch({ 
                ...upvoteQuestion(actionFromSocket.payload),
                meta: { fromSocket: true }
              });
              break;
            case 'events/deleteQuestion':
              store.dispatch({ 
                ...deleteQuestion(actionFromSocket.payload),
                meta: { fromSocket: true }
              });
              break;
            case 'events/setCurrentEvent':
              store.dispatch({ 
                ...setCurrentEvent(actionFromSocket.payload),
                meta: { fromSocket: true }
              });
              if (navigate && actionFromSocket.payload) {
                navigate(`/event/${actionFromSocket.payload}`);
              }
              break;
            case 'events/setCurrentQuestion':
              store.dispatch({ 
                ...setCurrentQuestion(actionFromSocket.payload),
                meta: { fromSocket: true }
              });
              if (navigate && actionFromSocket.payload) {
                const eventId = store.getState().events.currentEvent;
                if (eventId) {
                  navigate(`/event/${eventId}/question/${actionFromSocket.payload}`);
                }
              }
              break;
            default:
              break;
          }
        });

        socketInstance.on('disconnect', () => {
          console.log('Disconnected from server');
        });

        socketInstance.on('error', (error) => {
          console.error('Socket error:', error);
        });

        socketInstance.on('reconnect_attempt', (attempt) => {
          console.log(`Reconnection attempt ${attempt}`);
        });

        socketInstance.on('reconnect_failed', () => {
          console.error('Failed to reconnect to server');
        });
      }

      return socketInstance;
    };

    return next => (action: unknown) => {
      const actionWithType = action as ActionWithType;
      // Vérifier si cette action provient déjà d'un socket pour éviter les boucles
      const isFromSocket = actionWithType.meta && actionWithType.meta.fromSocket;
      
      // Propager les actions au serveur, mais uniquement si elles ne viennent pas déjà du socket
      if (!isFromSocket && actionWithType.type && (
        actionWithType.type === 'events/addEvent' ||
        actionWithType.type === 'events/addQuestion' ||
        actionWithType.type === 'events/upvoteQuestion' ||
        actionWithType.type === 'events/deleteQuestion' ||
        actionWithType.type === 'events/setCurrentEvent' ||
        actionWithType.type === 'events/setCurrentQuestion'
      )) {
        const now = Date.now();
        // Appliquer le throttling pour limiter le nombre de requêtes
        if (now - lastActionTime > THROTTLE_DELAY) {
          lastActionTime = now;
          const socket = getSocket();
          console.log('Emitting action to server:', actionWithType);
          socket.emit('action', actionWithType);
        } else {
          console.log('Action throttled:', actionWithType.type);
        }
      }

      return next(action);
    };
  };

