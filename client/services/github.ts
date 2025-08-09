import { z } from "zod";

export interface GitHubFile {
  name: string;
  path: string;
  type: "file" | "dir";
  size?: number;
  sha?: string;
  url?: string;
  html_url?: string;
  download_url?: string;
}

export interface GitHubRepo {
  name: string;
  full_name: string;
  description?: string;
  private: boolean;
  owner: {
    login: string;
    avatar_url: string;
  };
  default_branch: string;
  language?: string;
  updated_at: string;
}

const GitHubFileSchema = z.object({
  name: z.string(),
  path: z.string(),
  type: z.enum(["file", "dir"]),
  size: z.number().optional(),
  sha: z.string().optional(),
  url: z.string().optional(),
  html_url: z.string().optional(),
  download_url: z.string().url().nullable().optional(),
});

const GitHubRepoSchema = z.object({
  name: z.string(),
  full_name: z.string(),
  description: z.string().nullable().optional(),
  private: z.boolean(),
  owner: z.object({
    login: z.string(),
    avatar_url: z.string().url(),
  }),
  default_branch: z.string(),
  language: z.string().nullable().optional(),
  updated_at: z.string(),
});

class GitHubService {
  private baseUrl = "https://api.github.com";
  private token?: string;

  constructor(token?: string) {
    this.token = token;
  }

  setToken(token: string) {
    this.token = token;
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "TestCaseGenerator/1.0",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async fetchWithAuth(url: string) {
    const response = await fetch(url, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error(
          "GitHub API rate limit exceeded. Please provide a personal access token.",
        );
      } else if (response.status === 404) {
        throw new Error("Repository not found or access denied.");
      } else if (response.status === 401) {
        throw new Error("Invalid GitHub token or unauthorized access.");
      }
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  async getRepositoryInfo(owner: string, repo: string): Promise<GitHubRepo> {
    const url = `${this.baseUrl}/repos/${owner}/${repo}`;
    const data = await this.fetchWithAuth(url);
    return GitHubRepoSchema.parse(data);
  }

  async getRepositoryFiles(
    owner: string,
    repo: string,
    path: string = "",
    ref?: string,
  ): Promise<GitHubFile[]> {
    const url = `${this.baseUrl}/repos/${owner}/${repo}/contents/${path}${ref ? `?ref=${ref}` : ""}`;
    const data = await this.fetchWithAuth(url);

    if (!Array.isArray(data)) {
      throw new Error("Expected array of files");
    }

    return data.map((item) => GitHubFileSchema.parse(item));
  }

  async getFileContent(
    owner: string,
    repo: string,
    path: string,
    ref?: string,
  ): Promise<string> {
    const url = `${this.baseUrl}/repos/${owner}/${repo}/contents/${path}${ref ? `?ref=${ref}` : ""}`;
    const data = await this.fetchWithAuth(url);

    if (data.type !== "file") {
      throw new Error("Path does not point to a file");
    }

    if (data.encoding === "base64") {
      return atob(data.content.replace(/\s/g, ""));
    }

    return data.content;
  }

  async searchRepositoryFiles(
    owner: string,
    repo: string,
    query: string,
    extensions?: string[],
  ): Promise<GitHubFile[]> {
    const searchQuery = `repo:${owner}/${repo} ${query}${extensions ? ` extension:${extensions.join(" extension:")}` : ""}`;
    const url = `${this.baseUrl}/search/code?q=${encodeURIComponent(searchQuery)}&per_page=100`;

    const data = await this.fetchWithAuth(url);

    return (
      data.items?.map((item: any) => ({
        name: item.name,
        path: item.path,
        type: "file" as const,
        sha: item.sha,
        url: item.url,
        html_url: item.html_url,
      })) || []
    );
  }

  async getUserRepositories(username?: string): Promise<GitHubRepo[]> {
    const url = username
      ? `${this.baseUrl}/users/${username}/repos?sort=updated&per_page=100`
      : `${this.baseUrl}/user/repos?sort=updated&per_page=100`;

    const data = await this.fetchWithAuth(url);
    return data.map((repo: any) => GitHubRepoSchema.parse(repo));
  }

  parseRepositoryUrl(url: string): { owner: string; repo: string } | null {
    const patterns = [
      /github\.com\/([^\/]+)\/([^\/]+?)(?:\.git)?(?:\/.*)?$/,
      /^([^\/]+)\/([^\/]+)$/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return { owner: match[1], repo: match[2] };
      }
    }

    return null;
  }

  getTestableFileExtensions(): string[] {
    return [
      "js",
      "jsx",
      "ts",
      "tsx",
      "py",
      "java",
      "cpp",
      "c",
      "cs",
      "php",
      "rb",
      "go",
      "rs",
      "kt",
      "swift",
      "scala",
      "dart",
      "vue",
      "svelte",
    ];
  }

  isTestableFile(filename: string): boolean {
    const ext = filename.split(".").pop()?.toLowerCase();
    return ext ? this.getTestableFileExtensions().includes(ext) : false;
  }
}

export const githubService = new GitHubService();
export default GitHubService;
