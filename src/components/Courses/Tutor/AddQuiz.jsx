import React, { useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import SideBar from "../../../pages/Tutor/SideBar";
import axiosInstance from "../../../AxiosConfig";
import { toast } from "sonner";

export default function AddQuiz() {
  const navigate = useNavigate();
  const { id: courseId } = useParams();
  const {pagestatus} = useParams()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    course:courseId,
  });

  const handleQuestionChange = (e) => {
    setCurrentQuestion({ ...currentQuestion, questionText: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const handleCorrectAnswerChange = (value) => {
    setCurrentQuestion({ ...currentQuestion, correctAnswer: value });
  };

  const handleAddQuestion = () => {
    if (
      currentQuestion.questionText &&
      currentQuestion.options.every((option) => option) &&
      currentQuestion.correctAnswer
    ) {
      setQuestions([...questions, currentQuestion]);
      setCurrentQuestion({
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: "",
      });
    } else {
      alert("Please fill in all fields before adding the question.");
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axiosInstance.post(`/user/data/addquiz/${courseId}`, { questions });
      if (response) {
        toast.success("Quiz added successfully!");
        navigate(`/tutor/editcourse/${courseId}`);
      } else {
        toast.error("Failed to add quiz. Please try again.");
      }
    } catch (error) {
      console.error("Error adding quiz:", error);
      toast.error(error.response?.data?.message || "Failed to add quiz. Please try again.");
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SideBar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeItem="Courses"
      />
      <div className="flex-1 p-8">
        <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Create Quiz
            </h2>
            <div className="space-y-6">
              <div>
                <Label
                  htmlFor="question"
                  className="text-lg font-medium text-gray-700"
                >
                  Question
                </Label>
                <Textarea
                  id="question"
                  value={currentQuestion.questionText}
                  onChange={handleQuestionChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  rows={3}
                />
              </div>
              <div>
                <Label className="text-lg font-medium text-gray-700">
                  Options
                </Label>
                {currentQuestion.options.map((option, index) => (
                  <Input
                    key={index}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder={`Option ${index + 1}`}
                  />
                ))}
              </div>
              <div>
                <Label className="text-lg font-medium text-gray-700">
                  Correct Answer
                </Label>
                <RadioGroup
                  value={currentQuestion.correctAnswer}
                  onValueChange={handleCorrectAnswerChange}
                  className="mt-2"
                >
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`}>
                        {option || `Option ${index + 1}`}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <Button
                onClick={handleAddQuestion}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                Add Question
              </Button>
            </div>
          </CardContent>
        </Card>

        {questions.length > 0 && (
          <Card className="w-full max-w-4xl mx-auto mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Added Questions
              </h3>
              {questions.map((q, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium">
                    {index + 1}. {q.questionText}
                  </p>
                  <ul className="ml-6 mt-2 list-disc">
                    {q.options.map((option, optionIndex) => (
                      <li
                        key={optionIndex}
                        className={
                          option === q.correctAnswer
                            ? "text-green-600 font-medium"
                            : ""
                        }
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <Button
                onClick={handleSubmit}
                className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white"
              >
                Submit Quiz
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
