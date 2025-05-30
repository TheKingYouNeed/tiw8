import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import type { RootState } from '../models';
import QuestionList from './QuestionList';
import AdminQuestionList from './AdminQuestionList';
import QuestionCanvas from './QuestionCanvas';
import type { PublicEvent } from '../models';
import { setCurrentEvent, setCurrentQuestion, deleteQuestion } from '../store/slices/eventsSlice';

interface EventPanelProps {
  isAdmin?: boolean;
}

const EventPanel = ({ isAdmin = false }: EventPanelProps) => {
  const { eventId, questionId } = useParams<{ eventId: string; questionId?: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const event = useSelector((state: RootState) => 
    (state.events.events as PublicEvent[]).find((e: PublicEvent) => e.id === eventId)
  );
  const isMobile = useSelector((state: RootState) => state.events.isMobile as boolean);
  
  // Set the current event and question in the Redux store when the component mounts or params change
  useEffect(() => {
    if (eventId) {
      dispatch(setCurrentEvent(eventId));
    }
    
    if (questionId) {
      dispatch(setCurrentQuestion(questionId));
    }
  }, [eventId, questionId, dispatch]);
  
  if (!event) {
    return <div className="text-center text-xl p-4">Event not found</div>;
  }
  
  // Get the current question object from the event
  const currentQuestionObj = questionId ? 
    event.questions.find(q => q.id === questionId) : 
    null;
  
  // Function to navigate to the next or previous question
  const navigateQuestion = (direction: 'next' | 'prev') => {
    if (!event || !event.questions.length) return;
    console.log(`Navigating ${direction} from EventPanel`);
    
    let nextIndex = 0;
    
    if (questionId) {
      const currentIndex = event.questions.findIndex(q => q.id === questionId);
      if (currentIndex === -1) {
        console.log('Current question not found in questions array');
        return;
      }
      console.log(`Current index: ${currentIndex}, total questions: ${event.questions.length}`);
      
      if (direction === 'next') {
        nextIndex = (currentIndex + 1) % event.questions.length;
        console.log(`Going to next question (index ${nextIndex})`);
      } else {
        nextIndex = (currentIndex - 1 + event.questions.length) % event.questions.length;
        console.log(`Going to previous question (index ${nextIndex})`);
      }
    }
    
    const nextQuestion = event.questions[nextIndex];
    console.log(`Next question ID: ${nextQuestion.id}`);
    
    // First update the Redux state
    dispatch(setCurrentQuestion(nextQuestion.id));
    
    // Then navigate to the new URL
    const baseRoute = isAdmin ? `/admin/event/${eventId}` : `/event/${eventId}`;
    const newPath = `${baseRoute}/question/${nextQuestion.id}`;
    console.log(`Navigating to: ${newPath}`);
    
    // FIXED: Use window.location.href instead of navigate to force a full page reload
    // This ensures we completely reset the navigation state
    window.location.href = newPath;
    console.log('Navigation initiated with full page reload');
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{event.title}</h2>
        {isAdmin && (
          <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
            Mode Administrateur
          </div>
        )}
      </div>
      
      {questionId ? (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={() => navigateQuestion('prev')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg shadow-md text-sm md:text-base flex items-center"
              aria-label="Question précédente"
            >
              <span className="mr-1 text-xl">&#8249;</span> <span className="hidden sm:inline">Précédent</span>
            </button>
            <h3 className="text-lg font-semibold text-center mx-2 truncate max-w-[40%]">
              {currentQuestionObj?.text || 'Question'}
            </h3>
            <button 
              onClick={() => navigateQuestion('next')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg shadow-md text-sm md:text-base flex items-center"
              aria-label="Question suivante"
            >
              <span className="hidden sm:inline">Suivant</span> <span className="ml-1 text-xl">&#8250;</span>
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            {currentQuestionObj ? (
              <>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-medium">{currentQuestionObj.text}</h4>
                  {isAdmin && (
                    <button 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => {
                        if (window.confirm('Voulez-vous vraiment supprimer cette question ?')) {
                          dispatch(deleteQuestion({ eventId: eventId!, questionId: questionId! }));
                          // Navigate back to the event page after deletion
                          navigate(`/admin/event/${eventId}`);
                        }
                      }}
                    >
                      <span className="text-xl">&#x2715;</span>
                    </button>
                  )}
                </div>
                <p className="text-gray-700 mb-4">{currentQuestionObj.content}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-gray-600 mr-2">Votes: {currentQuestionObj.votes}</span>
                    <button 
                      className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600"
                      onClick={() => {
                        // Logique de vote à implémenter
                        alert('Fonctionnalité de vote disponible pour tous les utilisateurs');
                      }}
                    >
                      +1
                    </button>
                  </div>
                  <span className="text-gray-600">Par: {currentQuestionObj.author}</span>
                </div>
                {isAdmin && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h5 className="font-medium mb-2">Options d'administration</h5>
                    <div className="flex space-x-2">
                      <button 
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                        onClick={() => {
                          alert('Fonctionnalité de modification disponible uniquement en mode administrateur');
                        }}
                      >
                        Modifier
                      </button>
                      <button 
                        className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
                        onClick={() => {
                          alert('Fonctionnalité de mise en avant disponible uniquement en mode administrateur');
                        }}
                      >
                        Mettre en avant
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p>Question non trouvée</p>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isAdmin ? (
            <AdminQuestionList eventId={eventId!} />
          ) : (
            <QuestionList eventId={eventId!} />
          )}
        </div>
      )}
      
      {/* Only show gesture navigation on question detail pages and on mobile */}
      {isMobile && questionId && event.questions.length > 1 && (
        <div className="mt-4 border-t pt-4">
          <QuestionCanvas 
            eventId={eventId!} 
            questions={event.questions} 
            currentQuestionId={questionId}
          />
        </div>
      )}
    </div>
  );
};

export default EventPanel;
