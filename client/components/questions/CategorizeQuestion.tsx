import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X, GripVertical, Image as ImageIcon } from "lucide-react";
import { Question } from "@/pages/FormBuilder";

interface CategorizeQuestionProps {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
  onImageUpload: (file: File) => void;
}

export default function CategorizeQuestion({ question, onUpdate, onImageUpload }: CategorizeQuestionProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const updateData = (updates: any) => {
    onUpdate({ data: { ...question.data, ...updates } });
  };

  const addCategory = () => {
    const newCategory = `Category ${question.data.categories.length + 1}`;
    updateData({
      categories: [...question.data.categories, newCategory]
    });
  };

  const updateCategory = (index: number, value: string) => {
    const newCategories = [...question.data.categories];
    newCategories[index] = value;
    updateData({ categories: newCategories });
  };

  const removeCategory = (index: number) => {
    const newCategories = question.data.categories.filter((_: any, i: number) => i !== index);
    updateData({ categories: newCategories });
  };

  const addItem = () => {
    const newItem = `Item ${question.data.items.length + 1}`;
    updateData({
      items: [...question.data.items, newItem]
    });
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...question.data.items];
    newItems[index] = value;
    updateData({ items: newItems });
  };

  const removeItem = (index: number) => {
    const newItems = question.data.items.filter((_: any, i: number) => i !== index);
    updateData({ items: newItems });
  };

  const handleDragStart = (e: React.DragEvent, item: string) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, category: string) => {
    e.preventDefault();
    if (draggedItem) {
      console.log(`Dropped ${draggedItem} into ${category}`);
      setDraggedItem(null);
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

      {/* Categories */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Categories
          </label>
          <Button onClick={addCategory} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Add Category
          </Button>
        </div>
        <div className="space-y-2">
          {question.data.categories.map((category: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={category}
                onChange={(e) => updateCategory(index, e.target.value)}
                placeholder="Category name"
              />
              <Button
                onClick={() => removeCategory(index)}
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

      {/* Items */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Items to Categorize
          </label>
          <Button onClick={addItem} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Add Item
          </Button>
        </div>
        <div className="space-y-2">
          {question.data.items.map((item: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                placeholder="Item to categorize"
              />
              <Button
                onClick={() => removeItem(index)}
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

      {/* Preview */}
      <div className="border-t pt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Preview</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Categories */}
          <div>
            <h5 className="text-sm font-medium text-gray-600 mb-3">Categories</h5>
            <div className="space-y-3">
              {question.data.categories.map((category: string, index: number) => (
                <Card
                  key={index}
                  className="min-h-[100px] border-2 border-dashed border-gray-300 bg-gray-50"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, category)}
                >
                  <CardContent className="p-4">
                    <Badge variant="secondary" className="mb-2">
                      {category}
                    </Badge>
                    <p className="text-xs text-gray-500">Drop items here</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Items */}
          <div>
            <h5 className="text-sm font-medium text-gray-600 mb-3">Items</h5>
            <div className="space-y-2">
              {question.data.items.map((item: string, index: number) => (
                <Card
                  key={index}
                  className="cursor-move hover:shadow-md transition-shadow"
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                >
                  <CardContent className="p-3 flex items-center space-x-2">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{item}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
