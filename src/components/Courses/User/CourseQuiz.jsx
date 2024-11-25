import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../../../AxiosConfig';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from 'sonner';

export default function CourseQuiz() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  const userId = useSelector((store) => store.user.userDatas._id);
  console.log("user id-)))))____________)",userId)

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axiosInstance.get(`/user/data/getquiz/${courseId}`);
        setQuiz(response.data.quiz);
      } catch (error) {
        console.error('Error fetching quiz:', error);
        toast.error('Failed to load quiz');
      }
    };

    fetchQuiz();
  }, [courseId]);

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    try {
      const questionResults = quiz.questions.map(question => {
        const userAnswer = userAnswers[question._id] || null; // Set default as null if no answer selected
        return {
          questionId: question._id,
          isCorrect: userAnswer === question.correctAnswer,
          userAnswer, // Assign null if not answered
        };
      });
  
      const response = await axiosInstance.post('/user/data/submitquizresult', {
        userId,
        courseId,
        quizId: quiz._id,
        questionResults,
      });
  
      setQuizResult(response.data.result);
      setSubmitted(true);
      toast.success('Quiz submitted successfully!');
  
      if (response.data.result.certificateData) {
        toast.success('Congratulations! You have earned a certificate.');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz');
    }
  };

  const handleViewCertificate = () => {
    navigate(`/certificate/${courseId}`);
  };

  if (!quiz) {
    return <div className="text-center p-4">Loading quiz...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Course Quiz</h1>
      {quiz.questions.map((question, index) => (
        <Card key={question._id} className="mb-6">
          <CardHeader>
            <CardTitle>Question {index + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{question.questionText}</p>
            <RadioGroup
              onValueChange={(value) => handleAnswerChange(question._id, value)}
              value={userAnswers[question._id] || ''}
              disabled={submitted}
            >
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value={option} id={`q${question._id}-o${optionIndex}`} />
                  <Label htmlFor={`q${question._id}-o${optionIndex}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
            {submitted && (
              <div className="mt-4">
                <p
                  className={
                    userAnswers[question._id] === question.correctAnswer
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {userAnswers[question._id] === question.correctAnswer
                    ? "Correct!"
                    : "Incorrect"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      <CardFooter className="flex flex-col items-center space-y-4">
        {!submitted ? (
          <Button onClick={handleSubmit}>Submit Answers</Button>
        ) : (
          <>
            <div className="text-lg font-semibold text-center">
              <p>Your score: {quizResult.totalMarks} / {quizResult.totalQuestions}</p>
              <p>Percentage: {quizResult.percentageScore.toFixed(2)}%</p>
            </div>
            {quizResult.certificateData ? (
              <Button onClick={handleViewCertificate}>View Course Completion Certificate</Button>
            ) : (
              <p className="text-yellow-600">
                To get your course completion certificate, you need to score at least 90% on the quiz.
              </p>
            )}
            <Button onClick={() => navigate(`/course/${courseId}`)}>Back to Course</Button>
          </>
        )}
      </CardFooter>
    </div>
  );
}

