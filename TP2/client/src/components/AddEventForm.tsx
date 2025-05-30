import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addEvent } from '../store/slices/eventsSlice';
import { v4 as uuidv4 } from 'uuid';

const AddEventForm = () => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    
    const newEvent = {
      id: uuidv4(),
      title,
      description,
      questions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    dispatch(addEvent(newEvent));
    
    // Reset form
    setTitle('');
    setDescription('');
    setIsOpen(false);
  };

  return (
    <div className="mb-6">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full btn-primary py-2 px-4 rounded transition"
        >
          Créer un nouvel événement
        </button>
      ) : (
        <div className="event-card">
          <h3 className="text-lg font-semibold mb-3">Créer un nouvel événement</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="block mb-1">Titre de l'événement</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                placeholder="Entrez le titre de l'événement"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block mb-1">Description de l'événement</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                placeholder="Entrez la description de l'événement"
                rows={3}
                required
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 btn-primary rounded"
              >
                Créer
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddEventForm;
