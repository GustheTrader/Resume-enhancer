
'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  AlertCircle, 
  Zap, 
  FileText, 
  Download, 
  Eye, 
  Settings,
  Target,
  Sparkles,
  CheckCircle,
  TrendingUp,
  Shield
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import Link from "next/link";
import { marked } from 'marked';

interface Resume {
  id: string;
  originalName: string;
  fileType: string;
  originalContent: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  enhancements: Enhancement[];
}

interface Enhancement {
  id: string;
  enhancementType: string;
  enhancedContent: string;
  llmProvider: string;
  status: string;
  enhancementNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  resume: Resume;
  hasApiKeys: boolean;
}

const ENHANCEMENT_TYPES = [
  {
    value: "skills_certifications",
    label: "Skills & Certifications",
    description: "Highlight trade skills, licenses, and certifications",
    icon: <Shield className="h-4 w-4" />
  },
  {
    value: "project_experience",
    label: "Project Experience",
    description: "Showcase completed work and technical expertise",
    icon: <Target className="h-4 w-4" />
  },
  {
    value: "client_quality",
    label: "Client Success & Quality",
    description: "Emphasize customer satisfaction and quality work",
    icon: <Sparkles className="h-4 w-4" />
  }
];

// Configure marked for safe HTML rendering
marked.setOptions({
  breaks: true,
  gfm: true,
});

// Helper function to clean and render markdown
function cleanAndRenderMarkdown(content: string): string {
  // Remove code fences if present
  let cleaned = content.replace(/```markdown\n?/g, '').replace(/```\n?/g, '');
  
  // Convert markdown to HTML
  const html = marked.parse(cleaned) as string;
  
  return html;
}

export function EnhanceInterface({ resume, hasApiKeys }: Props) {
  const [selectedEnhancement, setSelectedEnhancement] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentEnhancement, setCurrentEnhancement] = useState<Enhancement | null>(null);
  const [previewMode, setPreviewMode] = useState<'original' | 'enhanced' | 'side-by-side'>('original');

  useEffect(() => {
    // Set the most recent enhancement as current if available
    if (resume.enhancements.length > 0) {
      setCurrentEnhancement(resume.enhancements[0]);
      setPreviewMode('side-by-side');
    }
  }, [resume.enhancements]);

  const handleEnhance = async () => {
    if (!selectedEnhancement) {
      toast.error("Please select an enhancement type");
      return;
    }

    if (!hasApiKeys) {
      toast.error("Please configure your API keys first");
      return;
    }

    setIsEnhancing(true);
    setProgress(0);
    
    try {
      const response = await fetch(`/api/enhance-resume/${resume.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enhancementType: selectedEnhancement,
        }),
      });

      if (!response.ok) {
        throw new Error("Enhancement failed");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (reader) {
        let buffer = '';
        let partialRead = '';
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          partialRead += decoder.decode(value, { stream: true });
          let lines = partialRead.split('\n');
          partialRead = lines.pop() || '';
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                setProgress(100);
                toast.success("Enhancement completed successfully!");
                // Refresh the page to show new enhancement
                window.location.reload();
                return;
              }
              
              try {
                const parsed = JSON.parse(data);
                if (parsed.status === 'processing') {
                  setProgress(prev => Math.min(prev + 5, 90));
                } else if (parsed.status === 'completed') {
                  setProgress(100);
                  toast.success("Enhancement completed!");
                  window.location.reload();
                  return;
                } else if (parsed.status === 'error') {
                  throw new Error(parsed.message || 'Enhancement failed');
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Enhancement error:", error);
      toast.error("Enhancement failed. Please try again.");
    } finally {
      setIsEnhancing(false);
      setProgress(0);
    }
  };

  const handleDownloadPdf = async () => {
    if (!currentEnhancement) {
      toast.error("No enhanced version available to download");
      return;
    }

    try {
      const response = await fetch(`/api/download-resume/${currentEnhancement.id}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `enhanced-${resume.originalName}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Resume downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download resume");
    }
  };

  if (!hasApiKeys) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You need to configure your API keys before you can enhance resumes.{" "}
            <Link href="/api-keys" className="text-orange-600 hover:underline font-medium">
              Set up API keys
            </Link>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enhance Resume</h1>
          <p className="text-gray-600 mt-1">{resume.originalName}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={resume.status === 'uploaded' ? 'secondary' : 'default'}>
            {resume.status}
          </Badge>
          {currentEnhancement && (
            <Button onClick={handleDownloadPdf} className="bg-orange-600 hover:bg-orange-700">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          )}
        </div>
      </div>

      {/* Enhancement Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            AI Enhancement
          </CardTitle>
          <CardDescription>
            Select the type of enhancement you'd like to apply to your resume
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {ENHANCEMENT_TYPES.map((type) => (
              <Card
                key={type.value}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedEnhancement === type.value
                    ? 'ring-2 ring-orange-600 bg-orange-50'
                    : ''
                }`}
                onClick={() => setSelectedEnhancement(type.value)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-orange-600 mt-0.5">
                      {type.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{type.label}</h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {type.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {isEnhancing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Enhancing your resume...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          <Button
            onClick={handleEnhance}
            disabled={!selectedEnhancement || isEnhancing}
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            {isEnhancing ? "Enhancing..." : "Enhance Resume"}
          </Button>
        </CardContent>
      </Card>

      {/* Preview Section */}
      {(resume.originalContent || currentEnhancement) && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Preview
              </CardTitle>
              <Select value={previewMode} onValueChange={(value: any) => setPreviewMode(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="original">Original Only</SelectItem>
                  {currentEnhancement && (
                    <>
                      <SelectItem value="enhanced">Enhanced Only</SelectItem>
                      <SelectItem value="side-by-side">Side by Side</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-6 ${previewMode === 'side-by-side' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
              {(previewMode === 'original' || previewMode === 'side-by-side') && (
                <div>
                  <h3 className="font-medium text-lg mb-4 text-gray-900">Original Resume</h3>
                  <div className="border rounded-lg p-6 bg-gray-50 max-h-[600px] overflow-y-auto">
                    {resume.fileType === 'pdf' ? (
                      <div className="prose prose-sm max-w-none">
                        <div 
                          className="text-sm text-gray-800"
                          dangerouslySetInnerHTML={{ 
                            __html: resume.originalContent 
                              ? cleanAndRenderMarkdown(resume.originalContent)
                              : '<p class="text-gray-500">PDF content is being processed...</p>'
                          }}
                        />
                      </div>
                    ) : (
                      <pre className="whitespace-pre-wrap text-sm text-gray-700">
                        {resume.originalContent || "Content not available"}
                      </pre>
                    )}
                  </div>
                </div>
              )}
              
              {currentEnhancement && (previewMode === 'enhanced' || previewMode === 'side-by-side') && (
                <div>
                  <h3 className="font-medium text-lg mb-4 text-gray-900">Enhanced Resume</h3>
                  <div className="border rounded-lg p-6 bg-green-50 max-h-[600px] overflow-y-auto">
                    <div 
                      className="prose prose-sm max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-strong:font-bold prose-strong:text-gray-900"
                      dangerouslySetInnerHTML={{ 
                        __html: cleanAndRenderMarkdown(currentEnhancement.enhancedContent)
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhancement History */}
      {resume.enhancements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Enhancement History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resume.enhancements.map((enhancement) => (
                <div
                  key={enhancement.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    currentEnhancement?.id === enhancement.id
                      ? 'border-orange-600 bg-orange-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setCurrentEnhancement(enhancement)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">
                        {ENHANCEMENT_TYPES.find(t => t.value === enhancement.enhancementType)?.label || enhancement.enhancementType}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {new Date(enhancement.createdAt).toLocaleDateString()} - {enhancement.llmProvider}
                      </p>
                    </div>
                    <Badge variant={enhancement.status === 'completed' ? 'default' : 'secondary'}>
                      {enhancement.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
