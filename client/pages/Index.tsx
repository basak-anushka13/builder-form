import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Index() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">FormCraft</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Create beautiful, interactive forms with ease
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/builder">Create New Form</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/forms">View All Forms</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Drag & Drop Builder</CardTitle>
            <CardDescription>
              Easily create forms with our intuitive drag and drop interface
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Real-time Preview</CardTitle>
            <CardDescription>
              See how your form looks as you build it with live preview
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Form Analytics</CardTitle>
            <CardDescription>
              Track form submissions and analyze user interactions
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
