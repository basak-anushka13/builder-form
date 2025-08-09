export interface GitHubRepository {
  owner: string;
  repo: string;
  branch?: string;
}

export interface TestCase {
  id: string;
  title: string;
  description: string;
  framework:
    | "jest"
    | "vitest"
    | "cypress"
    | "selenium"
    | "junit"
    | "pytest"
    | "mocha";
  testType: "unit" | "integration" | "e2e";
  files: string[];
  priority: "low" | "medium" | "high";
}

export interface TestCaseCode {
  id: string;
  testCaseId: string;
  framework: string;
  code: string;
  dependencies: string[];
  setupInstructions?: string;
}

export interface AnalyzeFilesRequest {
  repository: GitHubRepository;
  files: string[];
  framework?: string;
}

export interface AnalyzeFilesResponse {
  testCases: TestCase[];
  totalFiles: number;
  analyzedFiles: number;
}

export interface GenerateTestCodeRequest {
  testCaseId: string;
  framework: string;
  files: string[];
  repository: GitHubRepository;
}

export interface GenerateTestCodeResponse {
  code: string;
  dependencies: string[];
  setupInstructions?: string;
  filename: string;
}

export interface CreatePRRequest {
  repository: GitHubRepository;
  token: string;
  testCode: string;
  filename: string;
  testCaseTitle: string;
  testCaseDescription: string;
}

export interface CreatePRResponse {
  success: boolean;
  pullRequest: {
    number: number;
    url: string;
    title: string;
    branch: string;
  };
}
