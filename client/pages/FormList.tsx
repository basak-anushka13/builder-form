import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, Eye, Edit, Trash2 } from "lucide-react";

interface Form {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  questionCount: number;
}

export default function FormList() {
  const [forms, setForms] = useState<Form[]>([]);

  useEffect(() => {
    // Load forms from localStorage
    const savedForms = localStorage.getItem("forms");
    if (savedForms) {
      setForms(JSON.parse(savedForms));
    }
  }, []);

  const deleteForm = (id: string) => {
    const updatedForms = forms.filter(form => form.id !== id);
    setForms(updatedForms);
    localStorage.setItem("forms", JSON.stringify(updatedForms));
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">FormCraft</h1>
            </div>
            <Link to="/builder">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Form
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {forms.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to FormCraft</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Build custom forms with advanced question types including Categorize, Cloze, and Comprehension questions.
            </p>
            <Link to="/builder">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Form
              </Button>
            </Link>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Forms</h2>
              <Link to="/builder">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Form
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {forms.map((form) => (
                <Card key={form.id} className="hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {form.title || "Untitled Form"}
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      {form.questionCount} question{form.questionCount !== 1 ? 's' : ''}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {form.description || "No description"}
                    </p>
                    <p className="text-xs text-gray-400 mb-4">
                      Created {new Date(form.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex space-x-2">
                      <Link to={`/preview/${form.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                      </Link>
                      <Link to={`/builder/${form.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteForm(form.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
