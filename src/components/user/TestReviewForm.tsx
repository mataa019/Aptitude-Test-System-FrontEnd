import React, { useState, useEffect } from 'react';
import { getTestAttempt } from '../../api/user';

interface Question {
  id: string;
  type: string;
  text: string;
  options: string | null;
  marks: number;
  correctAnswer: string | null;
  submittedAnswer: string;
}

interface TestReviewData {
  id: string;
  testTemplate: {
    id: string;
    name: string;
    category: string;
    timeLimit: number;
  };
  submittedAt: string | null;
  startedAt: string;
  status: string;
  score: number | null;
  approved: boolean | null;
  assignment: {
    assignedAt: string;
    assignedBy: string;
  };
  questions: Question[];
  totalQuestions: number;
  answeredQuestions: number;
}

interface TestReviewFormProps {
  testId: string;
  onBack: () => void;
}

export const TestReviewForm: React.FC<TestReviewFormProps> = ({ testId, onBack }) => {
  const [testData, setTestData] = useState<TestReviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    const fetchTestAttempt = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching test attempt for testId:', testId);
        const response = await getTestAttempt(testId);
        console.log('Test attempt data:', response);
        
        // Check if the response contains an error
        if (response.error || response.message?.includes('No submitted test found')) {
          setError(response.message || 'No submitted test found for this template');
          return;
        }
        
        // The response has structure: { message: "...", data: {...} }
        // We want the data part which contains the test details
        const testData = response.data || response;
        
        // Validate that we have the required data structure
        if (!testData || !testData.testTemplate) {
          console.error('Invalid test data structure:', testData);
          setError('Invalid test data received');
          return;
        }
        
        console.log('Setting test data:', testData);
        setTestData(testData);
      } catch (err: any) {
        console.error('Failed to fetch test attempt:', err);
        setError(err.message || 'Failed to load test attempt');
      } finally {
        setLoading(false);
      }
    };

    fetchTestAttempt();
  }, [testId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          Error: {error}
        </div>
        <div className="mt-4">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!testData || !testData.testTemplate) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">No test data available</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
  const renderQuestion = (question: Question, index: number) => {
    switch (question.type) {
      case 'multiple-choice':
        const options = question.options ? JSON.parse(question.options) : [];
        
        return (
          <div key={question.id} className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {index + 1}. {question.text}
              </h3>
              <span className="text-sm text-gray-500">({question.marks} points)</span>
            </div>
            
            <div className="space-y-2">
              {options.map((option: string, optionIndex: number) => {
                const isSelected = question.submittedAnswer === option;
                
                return (
                  <div
                    key={optionIndex}
                    className={`flex items-center space-x-3 p-2 rounded ${
                      isSelected ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span className={`${isSelected ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                      {option}
                      {isSelected && ' (Your Answer)'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'boolean':
        return (
          <div key={question.id} className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {index + 1}. {question.text}
              </h3>
              <span className="text-sm text-gray-500">({question.marks} points)</span>
            </div>
            
            <div className="space-y-2">
              {['true', 'false'].map((option) => {
                const isSelected = question.submittedAnswer === option;
                
                return (
                  <div
                    key={option}
                    className={`flex items-center space-x-3 p-2 rounded ${
                      isSelected ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span className={`capitalize ${isSelected ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                      {option}
                      {isSelected && ' (Your Answer)'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'sentence':
        return (
          <div key={question.id} className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {index + 1}. {question.text}
              </h3>
              <span className="text-sm text-gray-500">({question.marks} points)</span>
            </div>
            
            <div className="bg-gray-50 border rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Your Answer:</p>
              <p className="text-gray-900 whitespace-pre-wrap">
                {question.submittedAnswer || 'No answer provided'}
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {testData.testTemplate.name} - Review
            </h1>
            <p className="text-gray-600">
              {testData.testTemplate.category} • {testData.testTemplate.timeLimit} minutes
            </p>
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${
              testData.status === 'submitted' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {testData.status}
            </span>
          </div>
        </div>

        {/* Test Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {testData.totalQuestions}
            </div>
            <div className="text-sm text-gray-500">Total Questions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {testData.answeredQuestions}
            </div>
            <div className="text-sm text-gray-500">Answered</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {new Date(testData.startedAt).toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-500">Started</div>
          </div>
        </div>
      </div>

      {/* Questions and Answers */}
      <div className="space-y-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900">Questions & Your Answers</h2>
        {testData.questions && testData.questions.length > 0 ? (
          testData.questions.map((question, index) => renderQuestion(question, index))
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <p className="text-gray-500">No questions data available for this test.</p>
          </div>
        )}
      </div>

      {/* Feedback Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes or Feedback</h3>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Add any notes, feedback, or comments about this test attempt..."
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
          rows={4}
        />
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => {
              // You can add save functionality here if needed
              console.log('Feedback saved:', feedback);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
          >
            Save Notes
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};
