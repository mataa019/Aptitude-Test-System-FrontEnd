import React from 'react';

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
  testData: TestReviewData;
  onBack: () => void;
}

export const TestReviewForm: React.FC<TestReviewFormProps> = ({ testData, onBack }) => {
  const renderQuestion = (question: Question, index: number) => {
    const isCorrect = question.correctAnswer 
      ? JSON.parse(question.correctAnswer).includes(question.submittedAnswer)
      : null; // Cannot determine for open-ended questions

    switch (question.type) {
      case 'multiple-choice':
        const options = question.options ? JSON.parse(question.options) : [];
        const correctAnswers = question.correctAnswer ? JSON.parse(question.correctAnswer) : [];
        
        return (
          <div key={question.id} className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {index + 1}. {question.text}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">({question.marks} points)</span>
                {isCorrect !== null && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    isCorrect 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </span>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              {options.map((option: string, optionIndex: number) => {
                const isSelected = question.submittedAnswer === option;
                const isCorrectOption = correctAnswers.includes(option);
                
                return (
                  <div
                    key={optionIndex}
                    className={`flex items-center space-x-3 p-2 rounded ${
                      isSelected && isCorrectOption
                        ? 'bg-green-50 border border-green-200'
                        : isSelected && !isCorrectOption
                        ? 'bg-red-50 border border-red-200'
                        : isCorrectOption
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                      isSelected 
                        ? isCorrectOption 
                          ? 'border-green-600 bg-green-600' 
                          : 'border-red-600 bg-red-600'
                        : isCorrectOption
                        ? 'border-green-600 bg-green-600'
                        : 'border-gray-300'
                    }`}>
                      {(isSelected || isCorrectOption) && (
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span className={`${
                      isSelected && !isCorrectOption 
                        ? 'text-red-700' 
                        : isCorrectOption
                        ? 'text-green-700'
                        : 'text-gray-700'
                    }`}>
                      {option}
                      {isSelected && ' (Your Answer)'}
                      {isCorrectOption && !isSelected && ' (Correct Answer)'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'boolean':
        const correctAnswer = question.correctAnswer ? JSON.parse(question.correctAnswer)[0] : null;
        const submittedAnswer = question.submittedAnswer;
        const booleanCorrect = correctAnswer === submittedAnswer;
        
        return (
          <div key={question.id} className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {index + 1}. {question.text}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">({question.marks} points)</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  booleanCorrect 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {booleanCorrect ? '✓ Correct' : '✗ Incorrect'}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              {['true', 'false'].map((option) => {
                const isSelected = submittedAnswer === option;
                const isCorrectOption = correctAnswer === option;
                
                return (
                  <div
                    key={option}
                    className={`flex items-center space-x-3 p-2 rounded ${
                      isSelected && isCorrectOption
                        ? 'bg-green-50 border border-green-200'
                        : isSelected && !isCorrectOption
                        ? 'bg-red-50 border border-red-200'
                        : isCorrectOption
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                      isSelected 
                        ? isCorrectOption 
                          ? 'border-green-600 bg-green-600' 
                          : 'border-red-600 bg-red-600'
                        : isCorrectOption
                        ? 'border-green-600 bg-green-600'
                        : 'border-gray-300'
                    }`}>
                      {(isSelected || isCorrectOption) && (
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span className={`capitalize ${
                      isSelected && !isCorrectOption 
                        ? 'text-red-700' 
                        : isCorrectOption
                        ? 'text-green-700'
                        : 'text-gray-700'
                    }`}>
                      {option}
                      {isSelected && ' (Your Answer)'}
                      {isCorrectOption && !isSelected && ' (Correct Answer)'}
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
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">({question.marks} points)</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Open-ended
                </span>
              </div>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <div className="text-2xl font-bold text-purple-600">
              {testData.score !== null ? testData.score : 'Pending'}
            </div>
            <div className="text-sm text-gray-500">Score</div>
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
        {testData.questions.map((question, index) => renderQuestion(question, index))}
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
