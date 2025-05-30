import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addQuestion } from '../store/slices/eventsSlice';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  eventId: string;
}

const AddQuestionForm = ({ eventId }: Props) => {
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim() || !content.trim() || !author.trim()) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    
    const newQuestion = {
      id: uuidv4(),
      text,
      content,
      author,
      votes: 0,
      color: getRandomColor(),
      position: {
        x: Math.floor(Math.random() * 100),
        y: Math.floor(Math.random() * 100)
      },
      size: {
        width: 200,
        height: 150
      }
    };
    
    dispatch(addQuestion({ eventId, question: newQuestion }));
    
    // Reset form
    setText('');
    setContent('');
    setAuthor('');
    setIsOpen(false);
  };
  
  const getRandomColor = () => {
    const colors = ['#f87171', '#60a5fa', '#4ade80', '#facc15', '#c084fc'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="mb-6">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Ajouter une nouvelle question
        </button>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3">Ajouter une nouvelle question</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="text" className="block text-gray-700 mb-1">Titre de la question</label>
              <input
                type="text"
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                placeholder="Entrez le titre de la question"
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="content" className="block text-gray-700 mb-1">Contenu de la question</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                placeholder="Entrez les détails de la question"
                rows={3}
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="author" className="block text-gray-700 mb-1">Votre nom</label>
              <input
                type="text"
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                placeholder="Entrez votre nom"
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
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Soumettre
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddQuestionForm;
