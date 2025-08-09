import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Github, Key } from 'lucide-react';
import { githubService } from '@/services/github';
import DemoMode from './DemoMode';

interface GitHubConnectProps {
  onConnect: (repoInfo: { owner: string; repo: string; token?: string }) => void;
  onStartDemo?: () => void;
}

export default function GitHubConnect({ onConnect, onStartDemo }: GitHubConnectProps) {
  const [repoUrl, setRepoUrl] = useState('');
  const [token, setToken] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    if (!repoUrl.trim()) {
      setError('Please enter a repository URL');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      const parsed = githubService.parseRepositoryUrl(repoUrl.trim());
      if (!parsed) {
        throw new Error('Invalid repository URL format');
      }

      if (token.trim()) {
        githubService.setToken(token.trim());
      }

      // Test the connection by fetching repository info
      await githubService.getRepositoryInfo(parsed.owner, parsed.repo);
      
      onConnect({
        owner: parsed.owner,
        repo: parsed.repo,
        token: token.trim() || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to repository');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConnect();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Github className="h-12 w-12 text-blue-600" />
        </div>
        <CardTitle className="text-2xl">Connect to GitHub Repository</CardTitle>
        <CardDescription>
          Enter your GitHub repository URL to analyze files and generate test cases
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="repo-url">Repository URL</Label>
          <Input
            id="repo-url"
            type="text"
            placeholder="https://github.com/owner/repository or owner/repository"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isConnecting}
          />
          <p className="text-sm text-muted-foreground">
            Examples: https://github.com/facebook/react or facebook/react
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="token" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Personal Access Token (Optional)
          </Label>
          <Input
            id="token"
            type="password"
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isConnecting}
          />
          <p className="text-sm text-muted-foreground">
            Required for private repositories or to increase rate limits. 
            <a 
              href="https://github.com/settings/tokens" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline ml-1"
            >
              Generate token
            </a>
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={handleConnect} 
          disabled={isConnecting || !repoUrl.trim()}
          className="w-full"
          size="lg"
        >
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Github className="mr-2 h-4 w-4" />
              Connect Repository
            </>
          )}
        </Button>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">What this tool can do:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Browse and analyze your repository files</li>
              <li>• Generate test cases for different testing frameworks</li>
              <li>• Create unit, integration, and E2E test suggestions</li>
              <li>• Generate ready-to-use test code</li>
              <li>• Support for React, Python, Java, and more</li>
            </ul>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-900 mb-2">Try these demo repositories:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <code className="text-green-800">facebook/react</code>
                <Badge variant="outline" className="text-xs bg-green-100 text-green-700">React</Badge>
              </div>
              <div className="flex items-center justify-between">
                <code className="text-green-800">microsoft/vscode</code>
                <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700">TypeScript</Badge>
              </div>
              <div className="flex items-center justify-between">
                <code className="text-green-800">django/django</code>
                <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-700">Python</Badge>
              </div>
            </div>
          </div>
        </div>

        {onStartDemo && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <DemoMode onStartDemo={onStartDemo} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
