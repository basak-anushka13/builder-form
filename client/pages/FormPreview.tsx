import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, GripVertical, Loader2 } from "lucide-react";
import { formAPI, responseAPI, Form, Question, Answer } from "@/services/api";

interface Answer {
  questionId: string;
  type: string;
  data: any;
}

interface CategorizeAnswer {
  [item: string]: string; // item -> category
}

interface ClozeAnswer {
  [blankId: string]: string;
}

interface ComprehensionAnswer {
  [subQuestionId: string]: string;
}

export default function FormPreview() {
  const { id } = useParams();
  const [form, setForm] = useState<Form | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const savedForms = localStorage.getItem("forms");
      if (savedForms) {
        const forms = JSON.parse(savedForms);
        const foundForm = forms.find((f: Form) => f.id === id);
        if (foundForm) {
          setForm(foundForm);
          // Initialize answers
          const initialAnswers: Answer[] = foundForm.questions.map((q: Question) => ({
            questionId: q.id,
            type: q.type,
            data: getInitialAnswerData(q)
          }));
          setAnswers(initialAnswers);
        }
      }
    }
  }, [id]);

  const getInitialAnswerData = (question: Question) => {
    switch (question.type) {
      case 'categorize':
        return {};
      case 'cloze':
        const clozeData: { [key: string]: string } = {};
        question.data.blanks?.forEach((blank: any, index: number) => {
          clozeData[index] = "";
        });
        return clozeData;
      case 'comprehension':
        const compData: { [key: string]: string } = {};
        question.data.questions?.forEach((subQ: any) => {
          compData[subQ.id] = "";
        });
        return compData;
      default:
        return {};
    }
  };

  const updateAnswer = (questionId: string, data: any) => {
    setAnswers(prev => prev.map(answer =>
      answer.questionId === questionId
        ? { ...answer, data: { ...answer.data, ...data } }
        : answer
    ));
  };

  const handleSubmit = () => {
    // Save responses
    const submission = {
      formId: id,
      answers,
      submittedAt: new Date().toISOString()
    };

    const savedResponses = localStorage.getItem("responses");
    const responses = savedResponses ? JSON.parse(savedResponses) : [];
    responses.push(submission);
    localStorage.setItem("responses", JSON.stringify(responses));

    setSubmitted(true);
  };

  const handleCategorizeItemDrop = (questionId: string, item: string, category: string) => {
    updateAnswer(questionId, { [item]: category });
  };

  const handleClozeBlankChange = (questionId: string, blankIndex: number, value: string) => {
    updateAnswer(questionId, { [blankIndex]: value });
  };

  const handleComprehensionAnswer = (questionId: string, subQuestionId: string, value: string) => {
    updateAnswer(questionId, { [subQuestionId]: value });
  };

  const renderCategorizeQuestion = (question: Question) => {
    const answer = answers.find(a => a.questionId === question.id);
    const categorizedItems = answer?.data || {};

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Categories */}
          <div>
            <h5 className="font-medium text-gray-700 mb-3">Categories</h5>
            <div className="space-y-3">
              {question.data.categories.map((category: string, index: number) => (
                <Card
                  key={index}
                  className="min-h-[100px] border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedItem) {
                      handleCategorizeItemDrop(question.id, draggedItem, category);
                      setDraggedItem(null);
                    }
                  }}
                >
                  <CardContent className="p-4">
                    <Badge variant="secondary" className="mb-2">
                      {category}
                    </Badge>
                    <div className="space-y-1">
                      {Object.entries(categorizedItems)
                        .filter(([_, cat]) => cat === category)
                        .map(([item]) => (
                          <div
                            key={item}
                            className="bg-white p-2 rounded border text-sm flex items-center"
                          >
                            <GripVertical className="w-3 h-3 mr-2 text-gray-400" />
                            {item}
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Items */}
          <div>
            <h5 className="font-medium text-gray-700 mb-3">Items to Categorize</h5>
            <div className="space-y-2">
              {question.data.items
                .filter((item: string) => !categorizedItems[item])
                .map((item: string, index: number) => (
                  <Card
                    key={index}
                    className="cursor-move hover:shadow-md transition-all bg-blue-50 border-blue-200"
                    draggable
                    onDragStart={(e) => {
                      setDraggedItem(item);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                  >
                    <CardContent className="p-3 flex items-center space-x-2">
                      <GripVertical className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium">{item}</span>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderClozeQuestion = (question: Question) => {
    const answer = answers.find(a => a.questionId === question.id);
    const blankAnswers = answer?.data || {};

    const renderClozeText = () => {
      let text = question.data.text || "";
      const blankRegex = /\[([^\]]+)\]/g;
      const parts = text.split(blankRegex);
      const elements = [];
      let blankIndex = 0;

      for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 0) {
          // Regular text
          elements.push(
            <span key={i} className="text-lg">
              {parts[i]}
            </span>
          );
        } else {
          // Blank space
          elements.push(
            <input
              key={i}
              type="text"
              className="inline-block min-w-[100px] border-b-2 border-blue-300 mx-1 px-2 py-1 bg-blue-50 rounded text-center font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={blankAnswers[blankIndex] || ''}
              onChange={(e) => handleClozeBlankChange(question.id, blankIndex, e.target.value)}
              placeholder="___"
            />
          );
          blankIndex++;
        }
      }

      return elements;
    };

    return (
      <div className="space-y-4">
        <div className="text-lg leading-relaxed">
          {renderClozeText()}
        </div>
      </div>
    );
  };

  const renderComprehensionQuestion = (question: Question) => {
    const answer = answers.find(a => a.questionId === question.id);
    const subAnswers = answer?.data || {};

    return (
      <div className="space-y-6">
        {/* Passage */}
        <div>
          <h5 className="font-semibold text-gray-800 mb-3">Reading Passage</h5>
          <div className="bg-white p-6 rounded-lg border font-serif leading-relaxed text-gray-800">
            {question.data.passage}
          </div>
        </div>

        {/* Questions */}
        <div>
          <h5 className="font-semibold text-gray-800 mb-3">Questions</h5>
          <div className="space-y-4">
            {question.data.questions?.map((subQ: any, index: number) => (
              <div key={subQ.id} className="bg-white p-4 rounded-lg border">
                <p className="font-medium text-gray-800 mb-3">
                  {index + 1}. {subQ.question}
                </p>

                {subQ.type === 'multiple-choice' && subQ.options && (
                  <div className="space-y-2 ml-4">
                    {subQ.options.map((option: string, i: number) => (
                      <label key={i} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${subQ.id}`}
                          value={option}
                          checked={subAnswers[subQ.id] === option}
                          onChange={(e) => handleComprehensionAnswer(question.id, subQ.id, e.target.value)}
                          className="text-blue-600"
                        />
                        <span className="text-sm">
                          {String.fromCharCode(65 + i)}. {option}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {subQ.type === 'true-false' && (
                  <div className="space-y-2 ml-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${subQ.id}`}
                        value="true"
                        checked={subAnswers[subQ.id] === "true"}
                        onChange={(e) => handleComprehensionAnswer(question.id, subQ.id, e.target.value)}
                        className="text-blue-600"
                      />
                      <span className="text-sm">True</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${subQ.id}`}
                        value="false"
                        checked={subAnswers[subQ.id] === "false"}
                        onChange={(e) => handleComprehensionAnswer(question.id, subQ.id, e.target.value)}
                        className="text-blue-600"
                      />
                      <span className="text-sm">False</span>
                    </label>
                  </div>
                )}

                {subQ.type === 'text' && (
                  <div className="ml-4">
                    <Textarea
                      value={subAnswers[subQ.id] || ""}
                      onChange={(e) => handleComprehensionAnswer(question.id, subQ.id, e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full"
                      rows={3}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Not Found</h2>
          <p className="text-gray-600 mb-4">The form you're looking for doesn't exist.</p>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for completing the form. Your responses have been saved.
          </p>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">Form Preview</h1>
            <div></div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form Header */}
        <div className="mb-8">
          {form.headerImage && (
            <img
              src={form.headerImage}
              alt="Form header"
              className="w-full h-48 object-cover rounded-lg mb-6"
            />
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {form.title || "Untitled Form"}
          </h1>
          {form.description && (
            <p className="text-lg text-gray-600">{form.description}</p>
          )}
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {form.questions.map((question, index) => (
            <Card key={question.id} className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <Badge variant="outline" className="capitalize">
                    {question.type}
                  </Badge>
                  <span>Question {index + 1}</span>
                </CardTitle>
                <h3 className="text-xl font-semibold text-gray-800">
                  {question.title}
                </h3>
                {question.image && (
                  <img
                    src={question.image}
                    alt="Question image"
                    className="w-full max-w-md h-48 object-cover rounded-lg"
                  />
                )}
              </CardHeader>
              <CardContent>
                {question.type === 'categorize' && renderCategorizeQuestion(question)}
                {question.type === 'cloze' && renderClozeQuestion(question)}
                {question.type === 'comprehension' && renderComprehensionQuestion(question)}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8 text-center">
          <Button 
            onClick={handleSubmit}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8"
          >
            Submit Form
          </Button>
        </div>
      </div>
    </div>
  );
}
