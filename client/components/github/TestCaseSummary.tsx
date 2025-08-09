import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TestTube, 
  Code, 
  Layers, 
  Globe, 
  ChevronDown, 
  ChevronRight,
  Loader2,
  FileCode
} from 'lucide-react';
import { TestCase } from '@shared/github';
import { cn } from '@/lib/utils';

interface TestCaseSummaryProps {
  testCases: TestCase[];
  onGenerateCode: (testCase: TestCase) => void;
  isGenerating: boolean;
  generatingTestId?: string;
}

export default function TestCaseSummary({ 
  testCases, 
  onGenerateCode, 
  isGenerating,
  generatingTestId 
}: TestCaseSummaryProps) {
  const [expandedTests, setExpandedTests] = useState<Set<string>>(new Set());

  const toggleExpanded = (testId: string) => {
    setExpandedTests(prev => {
      const next = new Set(prev);
      if (next.has(testId)) {
        next.delete(testId);
      } else {
        next.add(testId);
      }
      return next;
    });
  };

  const getTestTypeIcon = (type: TestCase['testType']) => {
    switch (type) {
      case 'unit':
        return <TestTube className="h-4 w-4" />;
      case 'integration':
        return <Layers className="h-4 w-4" />;
      case 'e2e':
        return <Globe className="h-4 w-4" />;
      default:
        return <Code className="h-4 w-4" />;
    }
  };

  const getTestTypeColor = (type: TestCase['testType']) => {
    switch (type) {
      case 'unit':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'integration':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'e2e':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: TestCase['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFrameworkBadgeColor = (framework: string) => {
    const colors: Record<string, string> = {
      jest: 'bg-orange-100 text-orange-800 border-orange-200',
      vitest: 'bg-green-100 text-green-800 border-green-200',
      cypress: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      selenium: 'bg-blue-100 text-blue-800 border-blue-200',
      junit: 'bg-red-100 text-red-800 border-red-200',
      pytest: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      mocha: 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return colors[framework.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (testCases.length === 0) {
    return (
      <Alert>
        <TestTube className="h-4 w-4" />
        <AlertDescription>
          No test cases generated. Please select files and try again.
        </AlertDescription>
      </Alert>
    );
  }

  const groupedTestCases = testCases.reduce((acc, testCase) => {
    if (!acc[testCase.testType]) {
      acc[testCase.testType] = [];
    }
    acc[testCase.testType].push(testCase);
    return acc;
  }, {} as Record<string, TestCase[]>);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Generated Test Cases ({testCases.length})
        </h3>
        
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs">
            {Object.keys(groupedTestCases).length} test types
          </Badge>
          <Badge variant="outline" className="text-xs">
            {new Set(testCases.map(tc => tc.framework)).size} frameworks
          </Badge>
        </div>
      </div>

      {Object.entries(groupedTestCases).map(([testType, tests]) => (
        <Card key={testType} className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              {getTestTypeIcon(testType as TestCase['testType'])}
              <span className="capitalize">{testType} Tests</span>
              <Badge className={cn("text-xs", getTestTypeColor(testType as TestCase['testType']))}>
                {tests.length} test{tests.length !== 1 ? 's' : ''}
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pt-0 space-y-3">
            {tests.map((testCase) => {
              const isExpanded = expandedTests.has(testCase.id);
              const isCurrentlyGenerating = isGenerating && generatingTestId === testCase.id;
              
              return (
                <div
                  key={testCase.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <button
                          onClick={() => toggleExpanded(testCase.id)}
                          className="flex items-center gap-1 text-sm font-medium hover:text-blue-600 transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          {testCase.title}
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs", getFrameworkBadgeColor(testCase.framework))}
                        >
                          {testCase.framework}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs", getPriorityColor(testCase.priority))}
                        >
                          {testCase.priority} priority
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {testCase.files.length} file{testCase.files.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                      
                      {isExpanded && (
                        <div className="mt-3 space-y-2">
                          <p className="text-sm text-gray-600">{testCase.description}</p>
                          
                          <div>
                            <p className="text-xs font-medium text-gray-700 mb-1">Target Files:</p>
                            <div className="space-y-1">
                              {testCase.files.map((file) => (
                                <div
                                  key={file}
                                  className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded flex items-center gap-1"
                                >
                                  <FileCode className="h-3 w-3" />
                                  {file}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <Button
                      onClick={() => onGenerateCode(testCase)}
                      disabled={isGenerating}
                      size="sm"
                      className="ml-4"
                    >
                      {isCurrentlyGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Code className="mr-2 h-3 w-3" />
                          Generate Code
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
