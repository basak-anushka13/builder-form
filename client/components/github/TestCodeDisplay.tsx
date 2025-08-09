import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Copy,
  Download,
  CheckCircle,
  Code,
  Package,
  Settings,
  ExternalLink,
  Github,
} from "lucide-react";
import { GenerateTestCodeResponse } from "@shared/github";

interface TestCodeDisplayProps {
  testCode: GenerateTestCodeResponse;
  onCreatePR?: () => void;
  canCreatePR?: boolean;
}

export default function TestCodeDisplay({
  testCode,
  onCreatePR,
  canCreatePR,
}: TestCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(testCode.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([testCode.code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = testCode.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getLanguageFromFilename = (filename: string): string => {
    const ext = filename.split(".").pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      py: "python",
      java: "java",
      cpp: "cpp",
      c: "c",
      cs: "csharp",
      php: "php",
      rb: "ruby",
      go: "go",
      rs: "rust",
      kt: "kotlin",
      swift: "swift",
      scala: "scala",
      dart: "dart",
    };
    return languageMap[ext || ""] || "text";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Generated Test Code
          </CardTitle>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCode}
              className="flex items-center gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>

            {canCreatePR && onCreatePR && (
              <Button
                onClick={onCreatePR}
                size="sm"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <Github className="h-4 w-4" />
                Create PR
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{testCode.filename}</Badge>
          <Badge variant="outline">
            {getLanguageFromFilename(testCode.filename)}
          </Badge>
          {testCode.dependencies.length > 0 && (
            <Badge variant="outline">
              {testCode.dependencies.length} dependencies
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="code" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Test Code
            </TabsTrigger>
            <TabsTrigger
              value="dependencies"
              className="flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              Dependencies
            </TabsTrigger>
            <TabsTrigger value="setup" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Setup
            </TabsTrigger>
          </TabsList>

          <TabsContent value="code" className="mt-4">
            <div className="relative">
              <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto text-sm">
                <code
                  className={`language-${getLanguageFromFilename(testCode.filename)}`}
                >
                  {testCode.code}
                </code>
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="dependencies" className="mt-4">
            <div className="space-y-4">
              {testCode.dependencies.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No additional dependencies required for this test.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="grid gap-2">
                    {testCode.dependencies.map((dep, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                      >
                        <code className="text-sm font-mono">{dep}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigator.clipboard.writeText(dep)}
                          className="h-6 px-2"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Alert>
                    <Package className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Installation command:</strong>
                      <br />
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                        npm install --save-dev {testCode.dependencies.join(" ")}
                      </code>
                    </AlertDescription>
                  </Alert>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="setup" className="mt-4">
            <div className="space-y-4">
              {testCode.setupInstructions ? (
                <Alert>
                  <Settings className="h-4 w-4" />
                  <AlertDescription>
                    <div className="whitespace-pre-wrap font-mono text-sm">
                      {testCode.setupInstructions}
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <AlertDescription>
                    No special setup instructions required.
                  </AlertDescription>
                </Alert>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>
                    1. Save the test code to{" "}
                    <code className="bg-blue-100 px-1 rounded">
                      {testCode.filename}
                    </code>
                  </li>
                  <li>2. Install required dependencies</li>
                  <li>3. Run the tests to verify they work</li>
                  <li>4. Customize the test cases as needed</li>
                  {canCreatePR && (
                    <li>5. Create a pull request with the generated tests</li>
                  )}
                </ul>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(
                      "https://jestjs.io/docs/getting-started",
                      "_blank",
                    )
                  }
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Jest Docs
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open("https://testing-library.com/docs/", "_blank")
                  }
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Testing Library
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open("https://cypress.io/docs", "_blank")
                  }
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Cypress Docs
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
