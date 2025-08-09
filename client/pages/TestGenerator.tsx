import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TestTube, 
  ArrowRight, 
  Loader2, 
  CheckCircle, 
  RefreshCw,
  Github,
  Sparkles
} from 'lucide-react';
import GitHubConnect from '@/components/github/GitHubConnect';
import FileBrowser from '@/components/github/FileBrowser';
import TestCaseSummary from '@/components/github/TestCaseSummary';
import TestCodeDisplay from '@/components/github/TestCodeDisplay';
import { TestCase, GenerateTestCodeResponse, AnalyzeFilesResponse } from '@shared/github';

type Step = 'connect' | 'select-files' | 'analyze' | 'generate-code';

interface RepoInfo {
  owner: string;
  repo: string;
  token?: string;
}

export default function TestGenerator() {
  const [currentStep, setCurrentStep] = useState<Step>('connect');
  const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<string>('jest');
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [generatedCode, setGeneratedCode] = useState<GenerateTestCodeResponse | null>(null);
  const [currentTestCase, setCurrentTestCase] = useState<TestCase | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [generatingTestId, setGeneratingTestId] = useState<string>();
  const [error, setError] = useState('');

  const handleRepoConnect = (repo: RepoInfo) => {
    setRepoInfo(repo);
    setCurrentStep('select-files');
    setError('');
  };

  const handleAnalyzeFiles = async () => {
    if (!repoInfo || selectedFiles.length === 0) {
      setError('Please select files to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const response = await fetch('/api/github/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repository: repoInfo,
          files: selectedFiles,
          framework: selectedFramework,
        }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const data: AnalyzeFilesResponse = await response.json();
      setTestCases(data.testCases);
      setCurrentStep('analyze');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze files');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateCode = async (testCase: TestCase) => {
    if (!repoInfo) return;

    setIsGeneratingCode(true);
    setGeneratingTestId(testCase.id);
    setError('');

    try {
      const response = await fetch('/api/github/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testCaseId: testCase.id,
          framework: testCase.framework,
          files: testCase.files,
          repository: repoInfo,
        }),
      });

      if (!response.ok) {
        throw new Error(`Code generation failed: ${response.statusText}`);
      }

      const data: GenerateTestCodeResponse = await response.json();
      setGeneratedCode(data);
      setCurrentTestCase(testCase);
      setCurrentStep('generate-code');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate test code');
    } finally {
      setIsGeneratingCode(false);
      setGeneratingTestId(undefined);
    }
  };

  const handleCreatePR = async () => {
    if (!repoInfo || !generatedCode || !repoInfo.token) {
      setError('GitHub token is required to create a pull request');
      return;
    }

    try {
      const testCase = testCases.find(tc => tc.id === 'current'); // You'd need to track which test case was generated
      const response = await fetch('/api/github/create-pr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repository: { owner: repoInfo.owner, repo: repoInfo.repo },
          token: repoInfo.token,
          testCode: generatedCode.code,
          filename: generatedCode.filename,
          testCaseTitle: testCase?.title || 'Automated Test Cases',
          testCaseDescription: testCase?.description || 'AI-generated test cases for repository files',
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create PR: ${response.statusText}`);
      }

      const result = await response.json();

      // Show success message and open PR
      alert(`Pull request created successfully! PR #${result.pullRequest.number}`);
      window.open(result.pullRequest.url, '_blank');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create pull request');
    }
  };

  const handleReset = () => {
    setCurrentStep('connect');
    setRepoInfo(null);
    setSelectedFiles([]);
    setTestCases([]);
    setGeneratedCode(null);
    setError('');
  };

  const getStepNumber = (step: Step): number => {
    const steps: Step[] = ['connect', 'select-files', 'analyze', 'generate-code'];
    return steps.indexOf(step) + 1;
  };

  const isStepCompleted = (step: Step): boolean => {
    const steps: Step[] = ['connect', 'select-files', 'analyze', 'generate-code'];
    return steps.indexOf(step) < steps.indexOf(currentStep);
  };

  const frameworks = [
    { value: 'jest', label: 'Jest' },
    { value: 'vitest', label: 'Vitest' },
    { value: 'cypress', label: 'Cypress' },
    { value: 'selenium', label: 'Selenium' },
    { value: 'junit', label: 'JUnit' },
    { value: 'pytest', label: 'Pytest' },
    { value: 'mocha', label: 'Mocha' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-full shadow-lg">
              <TestTube className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            AI Test Case Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect your GitHub repository and automatically generate comprehensive test cases
            for your code using AI-powered analysis.
          </p>
        </div>

        {/* Progress Steps */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {(['connect', 'select-files', 'analyze', 'generate-code'] as Step[]).map((step, index) => {
                const stepNumber = getStepNumber(step);
                const completed = isStepCompleted(step);
                const current = step === currentStep;
                
                return (
                  <div key={step} className="flex items-center">
                    <div className="flex items-center space-x-2">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                        ${completed ? 'bg-green-500 text-white' : 
                          current ? 'bg-blue-500 text-white' : 
                          'bg-gray-200 text-gray-600'}
                      `}>
                        {completed ? <CheckCircle className="h-4 w-4" /> : stepNumber}
                      </div>
                      <span className={`text-sm font-medium ${
                        completed || current ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step === 'connect' && 'Connect Repo'}
                        {step === 'select-files' && 'Select Files'}
                        {step === 'analyze' && 'Analyze & Review'}
                        {step === 'generate-code' && 'Generate Code'}
                      </span>
                    </div>
                    
                    {index < 3 && (
                      <ArrowRight className="h-4 w-4 text-gray-400 mx-4" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step Content */}
        {currentStep === 'connect' && (
          <GitHubConnect onConnect={handleRepoConnect} />
        )}

        {currentStep === 'select-files' && repoInfo && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Github className="h-5 w-5" />
                  Connected Repository: {repoInfo.owner}/{repoInfo.repo}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <label htmlFor="framework" className="text-sm font-medium">
                      Test Framework:
                    </label>
                    <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {frameworks.map((framework) => (
                          <SelectItem key={framework.value} value={framework.value}>
                            {framework.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button
                    onClick={() => setCurrentStep('connect')}
                    variant="outline"
                    size="sm"
                  >
                    Change Repository
                  </Button>
                </div>
              </CardContent>
            </Card>

            <FileBrowser
              owner={repoInfo.owner}
              repo={repoInfo.repo}
              onFilesSelect={setSelectedFiles}
              selectedFiles={selectedFiles}
            />

            {selectedFiles.length > 0 && (
              <div className="flex justify-center">
                <Button
                  onClick={handleAnalyzeFiles}
                  disabled={isAnalyzing}
                  size="lg"
                  className="flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing Files...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Analyze Files ({selectedFiles.length})
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        {currentStep === 'analyze' && testCases.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-sm">
                  {selectedFiles.length} files analyzed
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {testCases.length} test cases generated
                </Badge>
              </div>
              
              <Button
                onClick={() => setCurrentStep('select-files')}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Analyze Different Files
              </Button>
            </div>

            <TestCaseSummary
              testCases={testCases}
              onGenerateCode={handleGenerateCode}
              isGenerating={isGeneratingCode}
              generatingTestId={generatingTestId}
            />
          </div>
        )}

        {currentStep === 'generate-code' && generatedCode && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Generated Test Code</h2>
              <div className="flex gap-2">
                <Button
                  onClick={() => setCurrentStep('analyze')}
                  variant="outline"
                  size="sm"
                >
                  Back to Test Cases
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="sm"
                >
                  Start Over
                </Button>
              </div>
            </div>

            <TestCodeDisplay
              testCode={generatedCode}
              onCreatePR={handleCreatePR}
              canCreatePR={!!repoInfo?.token}
            />
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 py-8">
          <p>
            Built for Workik AI Internship Assignment • 
            Supports React, Python, Java, and more • 
            Generate unit, integration, and E2E tests
          </p>
        </div>
      </div>
    </div>
  );
}
