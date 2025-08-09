import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Image as ImageIcon, GripVertical } from "lucide-react";
import { Question } from "@/pages/FormBuilder";

interface ComprehensionQuestionProps {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
  onImageUpload: (file: File) => void;
}

interface ComprehensionSubQuestion {
  id: number;
  question: string;
  type: 'text' | 'multiple-choice' | 'true-false';
  options?: string[];
  correctAnswer?: string;
}

export default function ComprehensionQuestion({ question, onUpdate, onImageUpload }: ComprehensionQuestionProps) {
  const updateData = (updates: any) => {
    onUpdate({ data: { ...question.data, ...updates } });
  };

  const addSubQuestion = () => {
    const newQuestion: ComprehensionSubQuestion = {
      id: Date.now(),
      question: "",
      type: "text"
    };

    updateData({
      questions: [...(question.data.questions || []), newQuestion]
    });
  };

  const updateSubQuestion = (questionId: number, updates: Partial<ComprehensionSubQuestion>) => {
    const newQuestions = (question.data.questions || []).map((q: ComprehensionSubQuestion) =>
      q.id === questionId ? { ...q, ...updates } : q
    );
    updateData({ questions: newQuestions });
  };

  const removeSubQuestion = (questionId: number) => {
    const newQuestions = (question.data.questions || []).filter((q: ComprehensionSubQuestion) => q.id !== questionId);
    updateData({ questions: newQuestions });
  };

  const addOption = (questionId: number) => {
    const subQuestion = question.data.questions.find((q: ComprehensionSubQuestion) => q.id === questionId);
    if (subQuestion) {
      const newOptions = [...(subQuestion.options || []), ""];
      updateSubQuestion(questionId, { options: newOptions });
    }
  };

  const updateOption = (questionId: number, optionIndex: number, value: string) => {
    const subQuestion = question.data.questions.find((q: ComprehensionSubQuestion) => q.id === questionId);
    if (subQuestion && subQuestion.options) {
      const newOptions = [...subQuestion.options];
      newOptions[optionIndex] = value;
      updateSubQuestion(questionId, { options: newOptions });
    }
  };

  const removeOption = (questionId: number, optionIndex: number) => {
    const subQuestion = question.data.questions.find((q: ComprehensionSubQuestion) => q.id === questionId);
    if (subQuestion && subQuestion.options) {
      const newOptions = subQuestion.options.filter((_, i) => i !== optionIndex);
      updateSubQuestion(questionId, { options: newOptions });
    }
  };

  return (
    <div className="space-y-6">
      {/* Question Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Title
        </label>
        <Input
          value={question.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Enter question title..."
        />
      </div>

      {/* Question Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Image
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onImageUpload(file);
            }}
            className="hidden"
            id={`question-image-${question.id}`}
          />
          <label htmlFor={`question-image-${question.id}`}>
            <Button variant="outline" size="sm" className="cursor-pointer" asChild>
              <span>
                <ImageIcon className="w-4 h-4 mr-2" />
                Upload Image
              </span>
            </Button>
          </label>
          {question.image && (
            <img src={question.image} alt="Question" className="h-16 w-24 object-cover rounded" />
          )}
        </div>
      </div>

      {/* Passage */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reading Passage
        </label>
        <Textarea
          value={question.data.passage || ""}
          onChange={(e) => updateData({ passage: e.target.value })}
          placeholder="Enter the reading passage here..."
          rows={8}
          className="font-serif text-base leading-relaxed"
        />
      </div>

      {/* Sub Questions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Comprehension Questions
          </label>
          <Button onClick={addSubQuestion} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Add Question
          </Button>
        </div>

        <div className="space-y-4">
          {(question.data.questions || []).map((subQuestion: ComprehensionSubQuestion, index: number) => (
            <Card key={subQuestion.id} className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="flex items-center space-x-2">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <Badge variant="outline">Question {index + 1}</Badge>
                  <Select
                    value={subQuestion.type}
                    onValueChange={(value: any) => updateSubQuestion(subQuestion.id, { type: value })}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text Answer</SelectItem>
                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                      <SelectItem value="true-false">True/False</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() => removeSubQuestion(subQuestion.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Question Text */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Question
                  </label>
                  <Input
                    value={subQuestion.question}
                    onChange={(e) => updateSubQuestion(subQuestion.id, { question: e.target.value })}
                    placeholder="Enter the question..."
                  />
                </div>

                {/* Multiple Choice Options */}
                {subQuestion.type === 'multiple-choice' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-medium text-gray-600">
                        Options
                      </label>
                      <Button
                        onClick={() => addOption(subQuestion.id)}
                        size="sm"
                        variant="ghost"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Option
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {(subQuestion.options || []).map((option: string, optionIndex: number) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 w-4">
                            {String.fromCharCode(65 + optionIndex)}.
                          </span>
                          <Input
                            value={option}
                            onChange={(e) => updateOption(subQuestion.id, optionIndex, e.target.value)}
                            placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                            size="sm"
                          />
                          <Button
                            onClick={() => removeOption(subQuestion.id, optionIndex)}
                            size="sm"
                            variant="ghost"
                            className="text-red-600"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* True/False Options */}
                {subQuestion.type === 'true-false' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Correct Answer
                    </label>
                    <Select
                      value={subQuestion.correctAnswer || ""}
                      onValueChange={(value) => updateSubQuestion(subQuestion.id, { correctAnswer: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select correct answer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">True</SelectItem>
                        <SelectItem value="false">False</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Correct Answer for Multiple Choice */}
                {subQuestion.type === 'multiple-choice' && subQuestion.options && subQuestion.options.length > 0 && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Correct Answer
                    </label>
                    <Select
                      value={subQuestion.correctAnswer || ""}
                      onValueChange={(value) => updateSubQuestion(subQuestion.id, { correctAnswer: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select correct answer" />
                      </SelectTrigger>
                      <SelectContent>
                        {subQuestion.options.map((option: string, i: number) => (
                          <SelectItem key={i} value={option}>
                            {String.fromCharCode(65 + i)}: {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="border-t pt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Preview</h4>
        <Card className="bg-gray-50">
          <CardContent className="p-6">
            {question.data.passage ? (
              <div className="space-y-6">
                <div>
                  <h5 className="font-semibold text-gray-800 mb-3">Reading Passage</h5>
                  <div className="bg-white p-4 rounded border font-serif leading-relaxed text-gray-800">
                    {question.data.passage}
                  </div>
                </div>
                
                {question.data.questions && question.data.questions.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-3">Questions</h5>
                    <div className="space-y-4">
                      {question.data.questions.map((subQ: ComprehensionSubQuestion, index: number) => (
                        <div key={subQ.id} className="bg-white p-4 rounded border">
                          <p className="font-medium text-gray-800 mb-2">
                            {index + 1}. {subQ.question}
                          </p>
                          
                          {subQ.type === 'multiple-choice' && subQ.options && (
                            <div className="space-y-1 ml-4">
                              {subQ.options.map((option: string, i: number) => (
                                <div key={i} className="flex items-center space-x-2">
                                  <input type="radio" name={`preview-${subQ.id}`} disabled />
                                  <span className="text-sm">
                                    {String.fromCharCode(65 + i)}. {option}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {subQ.type === 'true-false' && (
                            <div className="space-y-1 ml-4">
                              <div className="flex items-center space-x-2">
                                <input type="radio" name={`preview-${subQ.id}`} disabled />
                                <span className="text-sm">True</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input type="radio" name={`preview-${subQ.id}`} disabled />
                                <span className="text-sm">False</span>
                              </div>
                            </div>
                          )}
                          
                          {subQ.type === 'text' && (
                            <div className="ml-4">
                              <input 
                                type="text" 
                                placeholder="Type your answer here..." 
                                className="w-full p-2 border rounded text-sm"
                                disabled
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Enter a reading passage to see preview
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
