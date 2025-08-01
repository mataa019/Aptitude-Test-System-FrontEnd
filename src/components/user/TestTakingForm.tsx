import React, { useState, useEffect } from 'react';
import type { Test, TestAnswer, Question } from '../../types/user';
import { Button } from '../common/Button';

interface TestTakingFormProps {
  test: Test;
  onSubmit: (answers: TestAnswer[], timeSpent: number) => void;
  isSubmitting?: boolean;
}

export const TestTakingForm: React.FC<TestTakingFormProps> = ({
  test,
  onSubmit,
  isSubmitting = false
}) => {
  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});
  const [timeLeft, setTimeLeft] = useState(test.timeLimit * 60); // Convert minutes to seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    const testAnswers: TestAnswer[] = Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      answer
    }));
    
    const timeSpent = (test.timeLimit * 60 - timeLeft) / 60; // Convert back to minutes
    onSubmit(testAnswers, timeSpent);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderQuestion = (question: Question, index: number) => {
    const answer = answers[question.id] || '';

    switch (question.type) {
      case 'multiple-choice':
        return (
          <div key={question.id} className="space-y-3">
            <h3 className="text-lg font-medium text-gray-900">
              {index + 1}. {question.text} ({question.points} points)
            </h3>
            <div className="space-y-2">
              {question.options?.map((option, optionIndex) => (
                <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={answer === option}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'boolean':
        return (
          <div key={question.id} className="space-y-3">
            <h3 className="text-lg font-medium text-gray-900">
              {index + 1}. {question.text} ({question.points} points)
            </h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value="true"
                  checked={answer === 'true'}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-gray-700">True</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value="false"
                  checked={answer === 'false'}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-gray-700">False</span>
              </label>
            </div>
          </div>
        );

      case 'text':
        return (
          <div key={question.id} className="space-y-3">
            <h3 className="text-lg font-medium text-gray-900">
              {index + 1}. {question.text} ({question.points} points)
            </h3>
            <textarea
              value={answer}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="Enter your answer here..."
            />
          </div>
        );

      default:
        return null;
    }
  };

  const answeredQuestions = Object.keys(answers).length;
  const totalQuestions = test.questions.length;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{test.title}</h1>
          <p className="text-gray-600 mt-2">{test.description}</p>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-mono ${timeLeft < 300 ? 'text-red-600' : 'text-blue-600'}`}>
            {formatTime(timeLeft)}
          </div>
          <p className="text-sm text-gray-500">Time Remaining</p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress: {answeredQuestions} of {totalQuestions} questions</span>
          <span>{Math.round((answeredQuestions / totalQuestions) * 100)}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-8 mb-8">
        {test.questions.map((question, index) => renderQuestion(question, index))}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <div className="text-sm text-gray-600">
          {answeredQuestions < totalQuestions && (
            <p>You have {totalQuestions - answeredQuestions} unanswered questions.</p>
          )}
        </div>
        <Button
          onClick={handleSubmit}
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Test'}
        </Button>
      </div>
    </div>
  );
};
