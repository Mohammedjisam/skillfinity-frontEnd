import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../../../AxiosConfig';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from 'sonner';
import { AlertCircle, Menu, CheckCircle, XCircle } from 'lucide-react';
import Sidebar from '../../../pages/User/Sidebar';
import { motion } from 'framer-motion';

export default function CourseQuiz() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [tutorData, setTutorData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const user = useSelector((store) => store.user.userDatas);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axiosInstance.get(`/user/data/getquiz/${courseId}`);
        setQuiz(response.data.quiz);
        setTutorData(response.data.quiz.courseData); 
      } catch (error) {
        console.error('Error fetching quiz:', error);
        toast.error("Failed to load quiz data");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchQuiz();
    } else {
      setLoading(false);
      toast.error("Course ID is missing. Please try accessing the quiz again.");
    }
  }, [courseId]);

  const handleSubmit = async () => {
    try {
      if (!user || !user._id) {
        toast.error("User information is missing. Please log in and try again.");
        return;
      }
      
      if (!tutorData || !tutorData.tutorId) {
        toast.error("Tutor information is missing. Please try again later.");
        return;
      }

      const questionResults = quiz.questions.map((question) => ({
        questionId: question._id.toString(), // Ensure questionId is a string
        userAnswer: userAnswers[question._id] || null,
        isCorrect: userAnswers[question._id] === question.correctAnswer,
      }));

      console.log("Submitting quiz results:", {
        userId: user._id,
        tutorId: tutorData.tutorId,
        courseId,
        quizId: quiz._id,
        questionResults,
      });

      const response = await axiosInstance.post("/user/data/submitquizresult", {
        userId: user._id,
        tutorId: tutorData.tutorId,
        courseId,
        quizId: quiz._id,
        questionResults,
      });

      setQuizResult(response.data.result);
      setSubmitted(true);
      toast.success("Quiz submitted successfully!");

      if (response.data.result.certificateData) {
        toast.success("Congratulations! You have earned a certificate.");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to submit quiz. Please try again.");
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  

  const handleViewCertificate = () => {
    navigate(`/certificate/${courseId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} activeItem="Courses" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm lg:hidden">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            {!quiz || !quiz.questions || quiz.questions.length === 0 ? (
              <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
                <CardHeader className="bg-gray-800 text-white p-6">
                  <CardTitle className="text-2xl font-bold">No Quiz Available</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-yellow-600 flex items-center space-x-2 mb-4">
                    <AlertCircle className="h-5 w-5" />
                    <span>There are no quiz questions available for this course at the moment.</span>
                  </p>
                  <p className="text-gray-600">
                    The course instructor may add quiz questions in the future. Please check back later or contact your instructor for more information.
                  </p>
                </CardContent>
                <CardFooter className="bg-gray-50 p-6">
                  <Button onClick={() => navigate(`/course/${courseId}/lessons`)} className="w-full bg-gray-800 hover:bg-gray-700 text-white">
                    Back to Course
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-gray-800">Course Quiz</h1>
                {quiz.questions.map((question, index) => (
                  <motion.div
                    key={question._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="bg-white shadow-md border-none rounded- overflow-hidden">
                      <CardHeader className="bg-gray-200 p-6">
                        <CardTitle className="text-xl font-semibold text-gray-800">Question {index + 1}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <p className="mb-4 text-gray-700 text-lg">{question.questionText}</p>
                        <RadioGroup
                          onValueChange={(value) => handleAnswerChange(question._id, value)}
                          value={userAnswers[question._id] || ''}
                          disabled={submitted}
                          className="space-y-2"
                        >
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                              <RadioGroupItem value={option} id={`q${question._id}-o${optionIndex}`} className="text-gray-800" />
                              <Label htmlFor={`q${question._id}-o${optionIndex}`} className="flex-grow cursor-pointer text-gray-700">{option}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                        {submitted && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 flex items-center space-x-2"
                          >
                            {userAnswers[question._id] === question.correctAnswer ? (
                              <CheckCircle className="text-green-500 h-5 w-5" />
                            ) : (
                              <XCircle className="text-red-500 h-5 w-5" />
                            )}
                            <p className={userAnswers[question._id] === question.correctAnswer ? "text-green-600" : "text-red-600"}>
                              {userAnswers[question._id] === question.correctAnswer ? "Correct!" : "Incorrect"}
                            </p>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
                <Card className="bg-white shadow-md rounded overflow-hidden border-none">
                  <CardContent className="p-6">
                    {!submitted ? (
                      <Button onClick={handleSubmit} className="w-full bg-gray-800 hover:bg-gray-700 text-white">
                        Submit Answers
                      </Button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-4"
                      >
                        <div className="text-lg font-semibold text-center">
                          <p className="text-gray-700">Your score: {quizResult.totalMarks} / {quizResult.totalQuestions}</p>
                          <p className="text-2xl text-gray-800">Percentage: {quizResult.percentageScore.toFixed(2)}%</p>
                        </div>
                        {quizResult.certificateData ? (
                          <Button onClick={handleViewCertificate} className="w-full bg-green-600 hover:bg-green-700 text-white">
                            View Course Completion Certificate
                          </Button>
                        ) : (
                          <p className="text-yellow-600 text-center">
                            To get your course completion certificate, you need to score at least 90% on the quiz.
                          </p>
                        )}
                        <Button onClick={() => navigate(`/course/${courseId}/lessons`)} className="w-full bg-gray-600 hover:bg-gray-700 text-white">
                          Back to Course
                        </Button>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

