'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'checkbox' | 'essay';
  question: string;
  options?: string[];
  correctAnswers?: string[];
  points: number;
}

interface QuizProps {
  moduleId: string;
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

export function QuizComponent({ moduleId, questions, onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const calculateScore = () => {
    let totalScore = 0;
    questions.forEach(question => {
      const answer = answers[question.id];
      if (question.type === 'essay') {
        // Essay questions need manual grading
        return;
      }
      if (Array.isArray(answer) && Array.isArray(question.correctAnswers)) {
        // For checkbox questions
        const isCorrect = answer.length === question.correctAnswers.length &&
          answer.every(a => question.correctAnswers?.includes(a));
        if (isCorrect) totalScore += question.points;
      } else if (answer === question.correctAnswers?.[0]) {
        // For multiple choice questions
        totalScore += question.points;
      }
    });
    return totalScore;
  };

  const handleSubmit = async () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setSubmitted(true);

    try {
      await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId,
          answers,
          score: finalScore
        })
      });

      onComplete(finalScore);
      toast.success('Quiz submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit quiz');
      console.error(error);
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <Card className="p-6 space-y-6">
      {!submitted ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Question {currentQuestion + 1} of {questions.length}
            </h2>
            <span className="text-sm text-gray-500">
              Points: {currentQ.points}
            </span>
          </div>

          <div className="space-y-4">
            <p className="text-lg">{currentQ.question}</p>

            {currentQ.type === 'multiple-choice' && (
              <RadioGroup
                value={answers[currentQ.id] as string}
                onValueChange={value => handleAnswer(currentQ.id, value)}
              >
                {currentQ.options?.map(option => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={option} />
                    <label htmlFor={option}>{option}</label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentQ.type === 'checkbox' && (
              <div className="space-y-2">
                {currentQ.options?.map(option => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={(answers[currentQ.id] as string[] || []).includes(option)}
                      onCheckedChange={(checked) => {
                        const currentAnswers = answers[currentQ.id] as string[] || [];
                        handleAnswer(
                          currentQ.id,
                          checked
                            ? [...currentAnswers, option]
                            : currentAnswers.filter(a => a !== option)
                        );
                      }}
                    />
                    <label htmlFor={option}>{option}</label>
                  </div>
                ))}
              </div>
            )}

            {currentQ.type === 'essay' && (
              <Textarea
                value={answers[currentQ.id] as string || ''}
                onChange={e => handleAnswer(currentQ.id, e.target.value)}
                placeholder="Enter your answer..."
                rows={6}
              />
            )}
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion(prev => prev - 1)}
            >
              Previous
            </Button>
            {currentQuestion === questions.length - 1 ? (
              <Button onClick={handleSubmit}>Submit Quiz</Button>
            ) : (
              <Button onClick={() => setCurrentQuestion(prev => prev + 1)}>
                Next
              </Button>
            )}
          </div>
        </>
      ) : (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Quiz Complete!</h2>
          <p className="text-xl">
            Your score: {score} / {questions.reduce((acc, q) => acc + q.points, 0)}
          </p>
          <Button onClick={() => window.location.reload()}>
            Take Quiz Again
          </Button>
        </div>
      )}
    </Card>
  );
} 