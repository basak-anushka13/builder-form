import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Sparkles, Github } from "lucide-react";

interface DemoModeProps {
  onStartDemo: () => void;
}

export default function DemoMode({ onStartDemo }: DemoModeProps) {
  return (
    <Card className="max-w-md mx-auto border-2 border-dashed border-blue-300 bg-blue-50/30">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <div className="bg-blue-100 p-3 rounded-full">
            <Play className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <CardTitle className="text-lg text-blue-900">Try Demo Mode</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-center">
        <p className="text-sm text-blue-700">
          Don't have a GitHub repository ready? Try our interactive demo with
          sample data!
        </p>

        <div className="space-y-2">
          <div className="flex justify-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700">
              React Components
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              Jest Tests
            </Badge>
          </div>
          <div className="flex justify-center gap-2">
            <Badge variant="outline" className="bg-purple-50 text-purple-700">
              Unit Tests
            </Badge>
            <Badge variant="outline" className="bg-orange-50 text-orange-700">
              Integration
            </Badge>
          </div>
        </div>

        <Button
          onClick={onStartDemo}
          className="w-full bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Start Interactive Demo
        </Button>

        <p className="text-xs text-blue-600">
          Perfect for screen recordings and presentations
        </p>
      </CardContent>
    </Card>
  );
}
