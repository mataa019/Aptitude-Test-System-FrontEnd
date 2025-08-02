import React, { useState } from 'react';
import type { Attempt } from '../../types/admin';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { markAttempt } from '../../api/admin';

interface AttemptReviewProps {
  attempt: Attempt;
  onMarkingComplete?: () => void;
  isLoading?: boolean;
}

export const AttemptReview: React.FC<AttemptReviewProps> = ({
  attempt,
  onMarkingComplete,
  isLoading: propIsLoading = false
}) => {
  const [feedback, setFeedback] = useState(attempt.feedback || '');
  const [isLoading, setIsLoading] = useState(propIsLoading);
  const [error, setError] = useState<string | null>(null);
  const [questionScores, setQuestionScores] = useState<{ [key: string]: number }>(() => {
    const scores: { [key: string]: number } = {};
    attempt.test.questions.forEach(question => {
      scores[question.id] = question.points; // Default to full points
    });
    return scores;
  });

  const handleQuestionScoreChange = (questionId: string, score: number) => {
    setQuestionScores(prev => ({ ...prev, [questionId]: score }));
  };

  const calculateTotalScore = () => {
    return Object.values(questionScores).reduce((sum, score) => sum + score, 0);
  };

  const handleMarkAttempt = async (approved: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const totalScore = calculateTotalScore();
      
      await markAttempt(attempt.id, totalScore, approved, token);
      
      if (onMarkingComplete) {
        onMarkingComplete();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to mark attempt');
      console.error('Error marking attempt:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserAnswer = (questionId: string) => {
    return attempt.answers.find(answer => answer.questionId === questionId)?.answer || 'No answer provided';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      {/* Header */}
      <div className="mb-6 pb-4 border-b">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Review Attempt</h1>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p><strong>Student:</strong> {attempt.user.firstName} {attempt.user.lastName}</p>
            <p><strong>Email:</strong> {attempt.user.email}</p>
            <p><strong>Test:</strong> {attempt.test.title}</p>
          </div>
          <div>
            <p><strong>Submitted:</strong> {new Date(attempt.submittedAt).toLocaleString()}</p>
            <p><strong>Time Spent:</strong> {attempt.timeSpent} minutes</p>
            <p><strong>Status:</strong> 
              <span className={`ml-1 px-2 py-1 text-xs rounded-full ${
                attempt.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                attempt.status === 'under-review' ? 'bg-blue-100 text-blue-800' :
                attempt.status === 'marked' ? 'bg-purple-100 text-purple-800' :
                'bg-green-100 text-green-800'
              }`}>
                {attempt.status.replace('-', ' ').toUpperCase()}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Questions and Answers */}
      <div className="space-y-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900">Questions and Answers</h2>
        {attempt.test.questions.map((question, index) => {
          const userAnswer = getUserAnswer(question.id);
          const currentScore = questionScores[question.id];
          
          return (
            <div key={question.id} className="border border-gray-200 rounded-lg p-4">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {index + 1}. {question.text}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Type: {question.type} | Max Points: {question.points}
                  {question.correctAnswer && (
                    <span className="ml-2 text-green-600">
                      Correct Answer: {question.correctAnswer}
                    </span>
                  )}
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded mb-4">
                <p className="text-sm text-gray-600 mb-1">Student's Answer:</p>
                <p className="text-gray-900">{userAnswer}</p>
              </div>

              <div className="flex items-center space-x-4">
                <Input
                  type="number"
                  label="Points"
                  value={currentScore}
                  onChange={(e) => handleQuestionScoreChange(question.id, Math.max(0, Math.min(question.points, Number(e.target.value))))}
                  min={0}
                  max={question.points}
                  className="w-24"
                />
                <div className="flex-1">
                  <div className={`text-sm font-medium ${
                    question.correctAnswer && userAnswer === question.correctAnswer 
                      ? 'text-green-600' 
                      : question.correctAnswer && userAnswer !== question.correctAnswer
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}>
                    {question.correctAnswer 
                      ? userAnswer === question.correctAnswer 
                        ? '✓ Correct' 
                        : '✗ Incorrect'
                      : 'Manual Review Required'
                    }
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall Feedback */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Overall Feedback
        </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={4}
          placeholder="Provide feedback for the student..."
        />
      </div>

      {/* Summary */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Grading Summary</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Total Score:</p>
            <p className="text-xl font-bold text-gray-900">
              {calculateTotalScore()}/{attempt.totalPoints}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Percentage:</p>
            <p className="text-xl font-bold text-gray-900">
              {((calculateTotalScore() / attempt.totalPoints) * 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-gray-600">Grade:</p>
            <p className={`text-xl font-bold ${
              (calculateTotalScore() / attempt.totalPoints) * 100 >= 80
                ? 'text-green-600'
                : (calculateTotalScore() / attempt.totalPoints) * 100 >= 60
                ? 'text-yellow-600'
                : 'text-red-600'
            }`}>
              {(calculateTotalScore() / attempt.totalPoints) * 100 >= 80
                ? 'A'
                : (calculateTotalScore() / attempt.totalPoints) * 100 >= 60
                ? 'B'
                : 'C'}
            </p>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button
          onClick={() => handleMarkAttempt(false)}
          variant="secondary"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Mark Only
        </Button>
        <Button
          onClick={() => handleMarkAttempt(true)}
          variant="primary"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Mark & Approve
        </Button>
      </div>
    </div>
  );
};
