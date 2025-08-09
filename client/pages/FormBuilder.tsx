import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Plus,
  Save,
  Eye,
  FileText,
  Image as ImageIcon,
  GripVertical,
  Trash2,
  Settings,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import CategorizeQuestion from "@/components/questions/CategorizeQuestion";
import ClozeQuestion from "@/components/questions/ClozeQuestion";
import ComprehensionQuestion from "@/components/questions/ComprehensionQuestion";
import { formAPI, Form, Question } from "@/services/api";

export default function FormBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>({
    id: "",
    title: "",
    description: "",
    questions: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadForm(id);
    }
  }, [id]);

  const loadForm = async (formId: string) => {
    try {
      setLoading(true);
      setError(null);
      const formData = await formAPI.getFormById(formId);
      setForm(formData);
    } catch (err) {
      setError("Failed to load form. Please try again.");
      console.error("Error loading form:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveForm = async () => {
    try {
      setSaving(true);
      setError(null);

      let savedForm;
      if (id) {
        // Update existing form
        savedForm = await formAPI.updateForm(id, form);
      } else {
        // Create new form
        savedForm = await formAPI.createForm(form);
        navigate(`/builder/${savedForm.id}`, { replace: true });
      }

      setForm(savedForm);
    } catch (err) {
      setError("Failed to save form. Please try again.");
      console.error("Error saving form:", err);
    } finally {
      setSaving(false);
    }
  };

  const addQuestion = (type: Question["type"]) => {
    const newQuestion: Question = {
      id: `question_${Date.now()}`,
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Question`,
      data: getDefaultQuestionData(type),
    };

    setForm((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const getDefaultQuestionData = (type: Question["type"]) => {
    switch (type) {
      case "categorize":
        return {
          categories: ["Category 1", "Category 2"],
          items: ["Item 1", "Item 2", "Item 3", "Item 4"],
        };
      case "cloze":
        return {
          text: "This is a sample sentence with a [blank] that needs to be filled.",
          blanks: [{ id: 1, answer: "word" }],
        };
      case "comprehension":
        return {
          passage: "Write your passage here...",
          questions: [{ id: 1, question: "Sample question?", type: "text" }],
        };
      default:
        return {};
    }
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, ...updates } : q,
      ),
    }));
  };

  const deleteQuestion = (questionId: string) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }));
  };

  const handleImageUpload = (
    file: File,
    target: "header" | "question",
    questionId?: string,
  ) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;

      if (target === "header") {
        setForm((prev) => ({ ...prev, headerImage: imageUrl }));
      } else if (target === "question" && questionId) {
        updateQuestion(questionId, { image: imageUrl });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-blue-600" />
                <h1 className="text-lg font-semibold text-gray-900">
                  Form Builder
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => navigate(`/preview/${form.id}`)}
                disabled={!form.id}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                onClick={saveForm}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {saving ? "Saving..." : "Save Form"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading form...</p>
          </div>
        ) : (
          <>
            {/* Form Header */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Form Settings
                  <Settings className="w-5 h-5 text-gray-500" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Form Title
                  </label>
                  <Input
                    value={form.title}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Enter form title..."
                    className="text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Enter form description..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Header Image
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, "header");
                      }}
                      className="hidden"
                      id="header-image"
                    />
                    <label htmlFor="header-image">
                      <Button
                        variant="outline"
                        className="cursor-pointer"
                        asChild
                      >
                        <span>
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Upload Image
                        </span>
                      </Button>
                    </label>
                    {form.headerImage && (
                      <img
                        src={form.headerImage}
                        alt="Header"
                        className="h-16 w-24 object-cover rounded"
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Questions */}
            <div className="space-y-6">
              {form.questions.map((question, index) => (
                <Card
                  key={question.id}
                  className="border-l-4 border-l-blue-500"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <div className="flex items-center space-x-3">
                      <GripVertical className="w-5 h-5 text-gray-400" />
                      <Badge variant="outline" className="capitalize">
                        {question.type}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Question {index + 1}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteQuestion(question.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {question.type === "categorize" && (
                      <CategorizeQuestion
                        question={question}
                        onUpdate={(updates) =>
                          updateQuestion(question.id, updates)
                        }
                        onImageUpload={(file) =>
                          handleImageUpload(file, "question", question.id)
                        }
                      />
                    )}
                    {question.type === "cloze" && (
                      <ClozeQuestion
                        question={question}
                        onUpdate={(updates) =>
                          updateQuestion(question.id, updates)
                        }
                        onImageUpload={(file) =>
                          handleImageUpload(file, "question", question.id)
                        }
                      />
                    )}
                    {question.type === "comprehension" && (
                      <ComprehensionQuestion
                        question={question}
                        onUpdate={(updates) =>
                          updateQuestion(question.id, updates)
                        }
                        onImageUpload={(file) =>
                          handleImageUpload(file, "question", question.id)
                        }
                      />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add Question */}
            <Card className="mt-6 border-dashed border-2 border-gray-300">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Add Question
                  </h3>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button
                      onClick={() => addQuestion("categorize")}
                      variant="outline"
                      className="flex flex-col h-20 w-32 p-3"
                    >
                      <Plus className="w-5 h-5 mb-1" />
                      <span className="text-xs">Categorize</span>
                    </Button>
                    <Button
                      onClick={() => addQuestion("cloze")}
                      variant="outline"
                      className="flex flex-col h-20 w-32 p-3"
                    >
                      <Plus className="w-5 h-5 mb-1" />
                      <span className="text-xs">Cloze</span>
                    </Button>
                    <Button
                      onClick={() => addQuestion("comprehension")}
                      variant="outline"
                      className="flex flex-col h-20 w-32 p-3"
                    >
                      <Plus className="w-5 h-5 mb-1" />
                      <span className="text-xs">Comprehension</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
