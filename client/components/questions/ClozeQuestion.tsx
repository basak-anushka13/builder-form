import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X, Image as ImageIcon } from "lucide-react";
import { Question } from "@/pages/FormBuilder";

interface ClozeQuestionProps {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
  onImageUpload: (file: File) => void;
}

export default function ClozeQuestion({ question, onUpdate, onImageUpload }: ClozeQuestionProps) {
  const [newBlankAnswer, setNewBlankAnswer] = useState("");

  const updateData = (updates: any) => {
    onUpdate({ data: { ...question.data, ...updates } });
  };

  const updateText = (text: string) => {
    // Auto-detect blanks in the text (marked with [blank] or [answer])
    const blankRegex = /\[([^\]]+)\]/g;
    const blanks: any[] = [];
    let match;
    let id = 1;

    while ((match = blankRegex.exec(text)) !== null) {
      blanks.push({
        id: id++,
        answer: match[1] === 'blank' ? '' : match[1]
      });
    }

    updateData({ text, blanks });
  };

  const addBlank = () => {
    if (!newBlankAnswer.trim()) return;
    
    const currentText = question.data.text || "";
    const newText = currentText + ` [${newBlankAnswer}]`;
    
    setNewBlankAnswer("");
    updateText(newText);
  };

  const updateBlank = (blankId: number, answer: string) => {
    const newBlanks = question.data.blanks.map((blank: any) =>
      blank.id === blankId ? { ...blank, answer } : blank
    );
    updateData({ blanks: newBlanks });

    // Update the text to reflect the new answer
    let updatedText = question.data.text;
    const blankRegex = /\[([^\]]+)\]/g;
    let match;
    let blankIndex = 0;

    updatedText = updatedText.replace(blankRegex, (fullMatch: string, content: string) => {
      if (blankIndex < newBlanks.length) {
        const blank = newBlanks[blankIndex];
        blankIndex++;
        if (blank.id === blankId) {
          return `[${answer}]`;
        }
      }
      return fullMatch;
    });

    updateData({ text: updatedText, blanks: newBlanks });
  };

  const removeBlank = (blankId: number) => {
    const newBlanks = question.data.blanks.filter((blank: any) => blank.id !== blankId);
    updateData({ blanks: newBlanks });
  };

  const renderPreviewText = () => {
    let text = question.data.text || "";
    const blankRegex = /\[([^\]]+)\]/g;
    
    return text.replace(blankRegex, (match, content) => {
      return `<span class="inline-block min-w-[100px] border-b-2 border-blue-300 mx-1 px-2 py-1 bg-blue-50 rounded text-center font-medium">${content || '_____'}</span>`;
    });
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

      {/* Text with Blanks */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text with Blanks
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Use [word] to create blanks. You can also type [blank] for empty blanks.
        </p>
        <Textarea
          value={question.data.text || ""}
          onChange={(e) => updateText(e.target.value)}
          placeholder="Enter your text with [blanks] here..."
          rows={4}
        />
      </div>

      {/* Quick Add Blank */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Add Blank
        </label>
        <div className="flex space-x-2">
          <Input
            value={newBlankAnswer}
            onChange={(e) => setNewBlankAnswer(e.target.value)}
            placeholder="Enter answer for new blank"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addBlank();
              }
            }}
          />
          <Button onClick={addBlank} variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Add Blank
          </Button>
        </div>
      </div>

      {/* Manage Blanks */}
      {question.data.blanks && question.data.blanks.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Manage Blanks
          </label>
          <div className="space-y-2">
            {question.data.blanks.map((blank: any, index: number) => (
              <div key={blank.id} className="flex items-center space-x-2">
                <Badge variant="outline">Blank {index + 1}</Badge>
                <Input
                  value={blank.answer}
                  onChange={(e) => updateBlank(blank.id, e.target.value)}
                  placeholder="Correct answer"
                />
                <Button
                  onClick={() => removeBlank(blank.id)}
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview */}
      <div className="border-t pt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Preview</h4>
        <Card className="bg-gray-50">
          <CardContent className="p-6">
            {question.data.text ? (
              <div 
                className="text-lg leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderPreviewText() }}
              />
            ) : (
              <p className="text-gray-500 text-center py-8">
                Enter text with blanks to see preview
              </p>
            )}
          </CardContent>
        </Card>
        
        {question.data.blanks && question.data.blanks.length > 0 && (
          <div className="mt-4">
            <h5 className="text-sm font-medium text-gray-600 mb-2">Answer Key</h5>
            <div className="flex flex-wrap gap-2">
              {question.data.blanks.map((blank: any, index: number) => (
                <Badge key={blank.id} variant="secondary">
                  {index + 1}: {blank.answer || 'No answer'}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
