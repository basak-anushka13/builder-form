import { RequestHandler } from "express";
import { z } from "zod";

const CreatePRSchema = z.object({
  repository: z.object({
    owner: z.string(),
    repo: z.string(),
  }),
  token: z.string(),
  testCode: z.string(),
  filename: z.string(),
  testCaseTitle: z.string(),
  testCaseDescription: z.string(),
});

export const createPullRequest: RequestHandler = async (req, res) => {
  try {
    const {
      repository,
      token,
      testCode,
      filename,
      testCaseTitle,
      testCaseDescription,
    } = CreatePRSchema.parse(req.body);

    // GitHub API endpoints
    const githubAPI = "https://api.github.com";
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "TestCaseGenerator/1.0",
      "Content-Type": "application/json",
    };

    // 1. Get the default branch reference
    const repoResponse = await fetch(
      `${githubAPI}/repos/${repository.owner}/${repository.repo}`,
      { headers },
    );

    if (!repoResponse.ok) {
      throw new Error(
        `Failed to get repository info: ${repoResponse.statusText}`,
      );
    }

    const repoData = await repoResponse.json();
    const defaultBranch = repoData.default_branch;

    // 2. Get the SHA of the default branch
    const refResponse = await fetch(
      `${githubAPI}/repos/${repository.owner}/${repository.repo}/git/refs/heads/${defaultBranch}`,
      { headers },
    );

    if (!refResponse.ok) {
      throw new Error(
        `Failed to get branch reference: ${refResponse.statusText}`,
      );
    }

    const refData = await refResponse.json();
    const baseSha = refData.object.sha;

    // 3. Create a new branch for the PR
    const branchName = `test-case-generator-${Date.now()}`;
    const createBranchResponse = await fetch(
      `${githubAPI}/repos/${repository.owner}/${repository.repo}/git/refs`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          ref: `refs/heads/${branchName}`,
          sha: baseSha,
        }),
      },
    );

    if (!createBranchResponse.ok) {
      throw new Error(
        `Failed to create branch: ${createBranchResponse.statusText}`,
      );
    }

    // 4. Create/update the test file
    const encodedContent = Buffer.from(testCode).toString("base64");

    // Check if file already exists
    let existingFileSha: string | undefined;
    try {
      const existingFileResponse = await fetch(
        `${githubAPI}/repos/${repository.owner}/${repository.repo}/contents/${filename}?ref=${branchName}`,
        { headers },
      );

      if (existingFileResponse.ok) {
        const existingFileData = await existingFileResponse.json();
        existingFileSha = existingFileData.sha;
      }
    } catch {
      // File doesn't exist, which is fine
    }

    const createFileResponse = await fetch(
      `${githubAPI}/repos/${repository.owner}/${repository.repo}/contents/${filename}`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify({
          message: `Add automated test cases: ${testCaseTitle}`,
          content: encodedContent,
          branch: branchName,
          ...(existingFileSha && { sha: existingFileSha }),
        }),
      },
    );

    if (!createFileResponse.ok) {
      const errorText = await createFileResponse.text();
      throw new Error(
        `Failed to create file: ${createFileResponse.statusText} - ${errorText}`,
      );
    }

    // 5. Create the pull request
    const prTitle = `🧪 Add automated test cases: ${testCaseTitle}`;
    const prBody = `## 🤖 AI-Generated Test Cases

### Description
${testCaseDescription}

### Generated Test File
- **File**: \`${filename}\`
- **Framework**: Detected from the generated code
- **Test Types**: Unit, Integration, and E2E tests as applicable

### What's Included
- Comprehensive test coverage for selected files
- Ready-to-run test cases
- Proper setup and teardown
- Error handling and edge cases

### Installation
After merging this PR, make sure to install the required dependencies:
\`\`\`bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
\`\`\`

### Running Tests
\`\`\`bash
npm test
\`\`\`

---
*This PR was generated automatically by the Test Case Generator tool.*`;

    const createPRResponse = await fetch(
      `${githubAPI}/repos/${repository.owner}/${repository.repo}/pulls`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          title: prTitle,
          body: prBody,
          head: branchName,
          base: defaultBranch,
        }),
      },
    );

    if (!createPRResponse.ok) {
      const errorText = await createPRResponse.text();
      throw new Error(
        `Failed to create pull request: ${createPRResponse.statusText} - ${errorText}`,
      );
    }

    const prData = await createPRResponse.json();

    res.json({
      success: true,
      pullRequest: {
        number: prData.number,
        url: prData.html_url,
        title: prData.title,
        branch: branchName,
      },
    });
  } catch (error) {
    console.error("Error creating pull request:", error);
    res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Failed to create pull request",
    });
  }
};
