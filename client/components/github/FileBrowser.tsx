import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Folder, 
  File, 
  Search, 
  Filter, 
  CheckSquare, 
  Square,
  Code,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { githubService, GitHubFile } from '@/services/github';
import { cn } from '@/lib/utils';

interface FileBrowserProps {
  owner: string;
  repo: string;
  onFilesSelect: (files: string[]) => void;
  selectedFiles: string[];
}

export default function FileBrowser({ owner, repo, onFilesSelect, selectedFiles }: FileBrowserProps) {
  const [files, setFiles] = useState<GitHubFile[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showTestableOnly, setShowTestableOnly] = useState(true);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadFiles('');
  }, [owner, repo]);

  const loadFiles = async (path: string = '') => {
    setLoading(true);
    setError('');
    try {
      const repoFiles = await githubService.getRepositoryFiles(owner, repo, path);
      setFiles(repoFiles);
      setCurrentPath(path);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const handleDirectoryClick = async (file: GitHubFile) => {
    if (file.type === 'dir') {
      const newPath = file.path;
      if (expandedDirs.has(newPath)) {
        // Collapse directory
        setExpandedDirs(prev => {
          const next = new Set(prev);
          next.delete(newPath);
          return next;
        });
      } else {
        // Expand directory
        try {
          setLoading(true);
          const dirFiles = await githubService.getRepositoryFiles(owner, repo, newPath);
          setExpandedDirs(prev => new Set(prev).add(newPath));
          
          // Add directory files to the main files list
          setFiles(prev => {
            const filtered = prev.filter(f => !f.path.startsWith(newPath + '/'));
            return [...filtered, ...dirFiles];
          });
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load directory');
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const handleFileSelect = (filePath: string, checked: boolean) => {
    if (checked) {
      onFilesSelect([...selectedFiles, filePath]);
    } else {
      onFilesSelect(selectedFiles.filter(f => f !== filePath));
    }
  };

  const handleSelectAll = () => {
    const testableFiles = getFilteredFiles().filter(f => f.type === 'file').map(f => f.path);
    if (selectedFiles.length === testableFiles.length) {
      onFilesSelect([]);
    } else {
      onFilesSelect(testableFiles);
    }
  };

  const getFilteredFiles = () => {
    let filtered = files;

    if (showTestableOnly) {
      filtered = filtered.filter(file => 
        file.type === 'dir' || githubService.isTestableFile(file.name)
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(file =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.path.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'dir' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  };

  const getFileIcon = (file: GitHubFile) => {
    if (file.type === 'dir') {
      return <Folder className="h-4 w-4 text-blue-500" />;
    }
    return <File className="h-4 w-4 text-gray-500" />;
  };

  const getFileExtension = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    return ext ? `.${ext}` : '';
  };

  const filteredFiles = getFilteredFiles();
  const testableFiles = filteredFiles.filter(f => f.type === 'file');
  const allSelected = testableFiles.length > 0 && testableFiles.every(f => selectedFiles.includes(f.path));

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Repository Files
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadFiles(currentPath)}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTestableOnly(!showTestableOnly)}
              className={cn(
                showTestableOnly && "bg-blue-50 border-blue-200 text-blue-700"
              )}
            >
              <Filter className="h-4 w-4 mr-1" />
              Testable Only
            </Button>
          </div>
        </div>

        {testableFiles.length > 0 && (
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
              className="text-sm"
            >
              {allSelected ? (
                <>
                  <CheckSquare className="h-4 w-4 mr-1" />
                  Deselect All
                </>
              ) : (
                <>
                  <Square className="h-4 w-4 mr-1" />
                  Select All
                </>
              )}
            </Button>
            
            <Badge variant="secondary">
              {selectedFiles.length} of {testableFiles.length} selected
            </Badge>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {currentPath && (
          <div className="mb-4 text-sm text-muted-foreground">
            <span className="font-medium">Current path:</span> /{currentPath}
            <Button
              variant="link"
              size="sm"
              onClick={() => loadFiles('')}
              className="ml-2 h-auto p-0"
            >
              Back to root
            </Button>
          </div>
        )}

        <div className="space-y-1 max-h-96 overflow-y-auto">
          {loading && filteredFiles.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading files...
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'No files match your search' : 'No files found'}
            </div>
          ) : (
            filteredFiles.map((file) => (
              <div
                key={file.path}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 border border-transparent",
                  file.type === 'file' && selectedFiles.includes(file.path) && 
                  "bg-blue-50 border-blue-200"
                )}
              >
                {file.type === 'file' && githubService.isTestableFile(file.name) && (
                  <Checkbox
                    checked={selectedFiles.includes(file.path)}
                    onCheckedChange={(checked) => 
                      handleFileSelect(file.path, checked as boolean)
                    }
                  />
                )}
                
                <button
                  onClick={() => handleDirectoryClick(file)}
                  className="flex items-center gap-2 flex-1 text-left"
                  disabled={file.type === 'file'}
                >
                  {getFileIcon(file)}
                  <span className="flex-1 truncate">{file.name}</span>
                  
                  {file.type === 'file' && (
                    <Badge variant="outline" className="text-xs">
                      {getFileExtension(file.name)}
                    </Badge>
                  )}
                </button>
              </div>
            ))
          )}
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-900 mb-2">
              Selected Files ({selectedFiles.length}):
            </p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {selectedFiles.map((filePath) => (
                <div
                  key={filePath}
                  className="flex items-center justify-between text-sm text-blue-800"
                >
                  <span className="truncate">{filePath}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFileSelect(filePath, false)}
                    className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
