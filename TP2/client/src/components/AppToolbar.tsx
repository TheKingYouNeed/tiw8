import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store';
import { setCurrentEvent } from '../store/slices/eventsSlice';
import type { PublicEvent } from '../models';

const AppToolbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const events = useSelector((state: RootState) => state.events.events) as PublicEvent[];
  const currentEvent = useSelector((state: RootState) => state.events.currentEvent) as string | null;

  const handleEventChange = (eventId: string) => {
    dispatch(setCurrentEvent(eventId));
    navigate(`/event/${eventId}`);
  };

  return (
    <nav className="app-header">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Application Q&R</h1>
        <select
          className="bg-gray-700 text-white px-4 py-2 rounded"
          value={currentEvent || ''}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleEventChange(e.target.value)}
        >
          <option value="">Sélectionner un événement</option>
          {events.map((event: PublicEvent) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
};

export default AppToolbar;
