import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { Question, PublicEvent } from '../models';
import type { RootState } from '../models';
import { upvoteQuestion } from '../store/slices/eventsSlice';
import AddQuestionForm from './AddQuestionForm';

interface Props {
  eventId: string;
}

const QuestionList = ({ eventId }: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const questions = useSelector((state: RootState) => {
    const event = (state.events.events as PublicEvent[]).find((e: PublicEvent) => e.id === eventId);
    return event ? event.questions : [];
  });

  const handleQuestionClick = (questionId: string) => {
    navigate(`/event/${eventId}/question/${questionId}`);
  };

  const handleUpvote = (questionId: string) => {
    dispatch(upvoteQuestion({ eventId, questionId }));
  };

  return (
    <div>
      <AddQuestionForm eventId={eventId} />
      
      <h3 className="text-xl font-semibold mb-4">Questions</h3>
      
      {questions.length === 0 ? (
        <div className="bg-white p-4 rounded-lg shadow text-center text-gray-500">
          No questions yet. Be the first to add one!
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question: Question) => (
            <div
              key={question.id}
              className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleQuestionClick(question.id)}
              style={question.color ? { borderLeft: `4px solid ${question.color}` } : undefined}
            >
              <h3 className="text-lg font-semibold mb-2">{question.text}</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">By: {question.author}</span>
                <span className="text-gray-600">Votes: {question.votes}</span>
              </div>
              <p className="text-gray-800 mb-3">{question.content}</p>
              <div className="flex justify-end">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleUpvote(question.id);
                  }}
                >
                  Upvote
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionList;
