import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { RootState, PublicEvent } from '../models';
import AddEventForm from './AddEventForm';

const EventsList = () => {
  const events = useSelector((state: RootState) => state.events.events);

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Événements Q&A</h1>
      
      <div className="max-w-lg mx-auto w-full">
        <AddEventForm />
        
        <h2 className="text-xl font-semibold mb-4 text-white">Événements disponibles</h2>
        
        {events.length === 0 ? (
          <div className="event-card text-center">
            Aucun événement disponible. Créez votre premier événement !
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event: PublicEvent) => (
              <Link 
                key={event.id}
                to={`/event/${event.id}`}
                className="block"
              >
                <div className="event-card hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="mb-3">{event.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span>{event.questions.length} questions</span>
                    <span>Créé le: {new Date(event.createdAt || Date.now()).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsList;
