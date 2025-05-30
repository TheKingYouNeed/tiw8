import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { Question, PublicEvent } from '../models';
import type { RootState } from '../models';
import { deleteQuestion, upvoteQuestion } from '../store/slices/eventsSlice';
import AddQuestionForm from './AddQuestionForm';

interface Props {
  eventId: string;
}

const AdminQuestionList = ({ eventId }: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const event = useSelector((state: RootState) => 
    (state.events.events as PublicEvent[]).find((e: PublicEvent) => e.id === eventId)
  );
  
  const questions = event ? event.questions : [];

  const handleDeleteQuestion = (questionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this question?')) {
      dispatch(deleteQuestion({ eventId, questionId }));
    }
  };

  const handleQuestionClick = (questionId: string) => {
    navigate(`/admin/event/${eventId}/question/${questionId}`);
  };

  const handleUpvote = (questionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(upvoteQuestion({ eventId, questionId }));
  };

  return (
    <div>
      <AddQuestionForm eventId={eventId} />
      
      <h3 className="text-xl font-semibold mb-4">Questions Management</h3>
      <p className="text-sm text-gray-400 mb-4">Admin mode: You can delete questions from this panel.</p>
      
      {questions.length === 0 ? (
        <div className="bg-white p-4 rounded-lg shadow text-center text-gray-500">
          No questions yet. Add one using the form above.
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
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{question.text}</h3>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={(e) => handleDeleteQuestion(question.id, e)}
                  title="Delete question"
                >
                  <span className="text-xl">&#x2715;</span>
                </button>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">By: {question.author}</span>
                <span className="text-gray-600">Votes: {question.votes}</span>
              </div>
              <p className="text-gray-800 mb-3">{question.content}</p>
              <div className="flex justify-end">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                  onClick={(e) => handleUpvote(question.id, e)}
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

export default AdminQuestionList;
