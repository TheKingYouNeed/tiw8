import type { Middleware } from 'redux';
import type { RootState } from '..';

interface ActionWithType {
  type: string;
  payload?: any;
}

/**
 * Middleware de journalisation pour Redux
 * Affiche l'état précédent, l'action et l'état suivant à chaque dispatch
 */
const loggerMiddleware: Middleware<{}, RootState> = (store) => (next) => (action: unknown) => {
  const actionWithType = action as ActionWithType;
  console.group(`%c Action: ${actionWithType.type || 'Unknown'}`, 'color: #3498db; font-weight: bold');
  console.log('%c État précédent:', 'color: #9b59b6; font-weight: bold', store.getState());
  console.log('%c Action:', 'color: #2ecc71; font-weight: bold', action);
  
  // Appel du prochain middleware dans la chaîne
  const result = next(action);
  
  console.log('%c État suivant:', 'color: #e67e22; font-weight: bold', store.getState());
  console.groupEnd();
  
  return result;
};

export default loggerMiddleware;
