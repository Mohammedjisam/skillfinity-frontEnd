import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { PlusCircle } from 'lucide-react';
import { toast } from "sonner";

export function AddQuizModal({ isOpen, onClose, onSubmit, existingQuestions }) {
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: "",
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
      onSubmit([...existingQuestions, currentQuestion]);
      setCurrentQuestion({
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: "",
      });
      toast.success("Question added successfully");
    } else {
      toast.error("Please fill in all fields before adding the question.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle>Add Quiz Question</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="question">Question</Label>
            <Textarea
              id="question"
              value={currentQuestion.questionText}
              onChange={handleQuestionChange}
              rows={3}
              placeholder="Enter your question"
            />
          </div>
          <div className="grid gap-2">
            <Label>Options</Label>
            {currentQuestion.options.map((option, index) => (
              <Input
                key={index}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
              />
            ))}
          </div>
          <div className="grid gap-2">
            <Label>Correct Answer</Label>
            <RadioGroup
              value={currentQuestion.correctAnswer}
              onValueChange={handleCorrectAnswerChange}
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
        </div>
        <DialogFooter>
          <Button onClick={handleAddQuestion}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

