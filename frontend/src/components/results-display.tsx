"use client";

import { useState, useEffect } from "react";
import { 
  Copy, 
  Download, 
  FileText, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Target,
  Hash,
  Share,
  Loader2,
  History,
  Brain
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useGenerationStore } from "@/lib/stores/generation-store";
import { useHistoryStore } from "@/lib/stores/history-store";
import { useLinkedInStore } from "@/lib/stores/linkedin-store";
import { copyToClipboard, downloadTextFile, generateId, formatExecutionTime, cn } from "@/lib/utils";
import { HistoryItem, LinkedInPostRequest } from "@/lib/types";

export function ResultsDisplay() {
  const { generationState } = useGenerationStore();
  const { addHistoryItem } = useHistoryStore();
  const { linkedInState, checkLinkedInStatus, postToLinkedIn } = useLinkedInStore();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const result = generationState.result;

  // Check LinkedIn status when component mounts and initialize edited content
  useEffect(() => {
    checkLinkedInStatus();
    if (result?.generated_content) {
      setEditedContent(result.generated_content);
    }
  }, [checkLinkedInStatus, result?.generated_content]);

  if (!result) {
    return null;
  }

  const handleCopy = async (text: string, field: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleDownload = () => {
    const content = `Topic: ${result.topic}
Platform: ${result.platform}
Tone: ${result.tone}
Generated: ${new Date().toLocaleString()}
Execution Time: ${formatExecutionTime(result.execution_time_seconds)}

RESEARCH INSIGHTS:
${result.research_bullet_points.map((point, i) => `${i + 1}. ${point}`).join('\n')}

GENERATED CONTENT:
${result.generated_content}

Word Count: ${result.word_count}
${result.generated_image_path ? `Image: ${result.generated_image_path}` : ''}`;

    const filename = `content_${result.topic.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.txt`;
    downloadTextFile(content, filename);
  };

  const handleSaveToHistory = () => {
    const historyItem: HistoryItem = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      request: {
        topic: result.topic,
        platform: result.platform,
        tone: result.tone,
      },
      response: result,
    };
    addHistoryItem(historyItem);
  };

  const handleLinkedInPost = async () => {
    if (!editedContent.trim() || isPosting) return;

    setIsPosting(true);
    try {
      const request: LinkedInPostRequest = {
        content: editedContent.trim(),
        visibility: "PUBLIC" as const,
      };

      // Add image path if available (filename only)
      if (result.generated_image_path) {
        const filename = result.generated_image_path.split('/').pop() || result.generated_image_path;
        request.image_path = filename;
      }

      const response = await postToLinkedIn(request);
      
      if (response.success && response.linkedin_url) {
        // Optional: Show success message or redirect
        console.log("Posted to LinkedIn:", response.linkedin_url);
      }
    } catch (error) {
      console.error("Failed to post to LinkedIn:", error);
    } finally {
      setIsPosting(false);
    }
  };

  const CopyButton = ({ text, field, label }: { text: string; field: string; label: string }) => (
    <Button
      variant="outline"
      size="sm"
      onClick={() => handleCopy(text, field)}
      className="h-8"
    >
      {copiedField === field ? (
        <CheckCircle2 className="h-3 w-3 mr-1" />
      ) : (
        <Copy className="h-3 w-3 mr-1" />
      )}
      {copiedField === field ? "Copied!" : label}
    </Button>
  );

  return (
    <>
    <Card className="w-full glass-strong shadow-elevated border-0 animate-fade-in">
      <CardHeader className="pb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg",
              result.success ? "gradient-success" : "bg-brand-error"
            )}>
              {result.success ? (
                <CheckCircle2 className="h-6 w-6 text-white" />
              ) : (
                <AlertCircle className="h-6 w-6 text-white" />
              )}
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                Generation Results
              </CardTitle>
              <CardDescription className="text-base mt-1">
                Content generated for &quot;{result.topic}&quot;
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {/* LinkedIn Post Button */}
            {result.success && linkedInState.isConfigured && (
              <Button
                onClick={handleLinkedInPost}
                disabled={isPosting || !editedContent.trim()}
                className="bg-[#0077B5] hover:bg-[#005885] text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                size="lg"
              >
                {isPosting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Share className="h-4 w-4 mr-2" />
                    Post to LinkedIn
                  </>
                )}
              </Button>
            )}
            <Button 
              onClick={handleSaveToHistory} 
              variant="outline" 
              size="lg"
              className="glass hover:glass-strong shadow-md hover:shadow-lg transition-all"
            >
              <History className="h-4 w-4 mr-2" />
              Save to History
            </Button>
            <Button 
              onClick={handleDownload} 
              variant="outline" 
              size="lg"
              className="glass hover:glass-strong shadow-md hover:shadow-lg transition-all"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Target, label: "Platform", value: result.platform },
            { icon: Hash, label: "Tone", value: result.tone },
            { icon: Calendar, label: "Generation Time", value: formatExecutionTime(result.execution_time_seconds) },
            { icon: FileText, label: "Word Count", value: `${result.word_count} words` }
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border/40">
              <div className="w-10 h-10 rounded-lg bg-brand-accent/10 flex items-center justify-center">
                <item.icon className="h-5 w-5 text-brand-accent" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{item.label}</div>
                <div className="font-semibold">{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        {!result.success && result.error && (
          <div className="p-6 bg-brand-error/5 border-2 border-brand-error/20 rounded-xl animate-fade-in">
            <div className="flex items-center gap-3 text-brand-error">
              <AlertCircle className="h-6 w-6" />
              <div>
                <div className="font-semibold text-lg">Generation Error</div>
                <p className="text-sm mt-1 opacity-80">{result.error}</p>
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-12 p-1 glass-strong">
            <TabsTrigger 
              value="content" 
              className="flex items-center gap-2 font-medium data-[state=active]:gradient-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
            >
              <FileText className="h-4 w-4" />
              Generated Content
            </TabsTrigger>
            <TabsTrigger 
              value="research"
              className="flex items-center gap-2 font-medium data-[state=active]:gradient-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
            >
              <Brain className="h-4 w-4" />
              Research Insights
            </TabsTrigger>
            <TabsTrigger 
              value="media"
              className="flex items-center gap-2 font-medium data-[state=active]:gradient-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
            >
              <ImageIcon className="h-4 w-4" />
              Media
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="mt-6">
            <div className="glass-strong rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  Generated Content
                </h3>
                <CopyButton 
                  text={editedContent} 
                  field="content" 
                  label="Copy Content" 
                />
              </div>
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[300px] text-base leading-relaxed bg-background/50 border-border/60 focus:border-brand-accent focus:ring-brand-accent/20 rounded-xl"
                placeholder="Edit your content here..."
              />
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold">{editedContent.split(/\s+/).filter(word => word.length > 0).length}</span> words
                </div>
                <div className="text-xs text-muted-foreground">
                  Edit content above and changes will be reflected in all actions
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="research" className="mt-6">
            <div className="glass-strong rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  Research Insights
                </h3>
                <CopyButton 
                  text={result.research_bullet_points.join('\n')} 
                  field="research" 
                  label="Copy Research" 
                />
              </div>
              <div className="space-y-4">
                {result.research_bullet_points.map((point, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-background/50 rounded-xl border border-border/40 hover:border-brand-accent/40 transition-colors">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-accent/10 text-brand-accent font-bold shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-base leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-brand-accent/5 rounded-xl border border-brand-accent/20">
                <div className="flex items-center gap-2 text-brand-accent mb-2">
                  <Brain className="h-4 w-4" />
                  <span className="font-semibold">Research Summary</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Our research agent found <span className="font-semibold">{result.research_bullet_points.length}</span> key insights to inform your content creation.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="media" className="mt-6">
            <div className="glass-strong rounded-xl p-6 space-y-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
                  <ImageIcon className="h-4 w-4 text-white" />
                </div>
                Generated Media
              </h3>
              
              {result.generated_image_path ? (
                <div className="space-y-6">
                  <div className="relative rounded-xl border-2 border-border/40 overflow-hidden bg-muted/20 shadow-lg">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}/${result.generated_image_path}`}
                      alt={`Generated image for ${result.topic}`}
                      className="w-full h-auto max-h-[500px] object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden p-12 text-center text-muted-foreground">
                      <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">Image could not be loaded</p>
                      <p className="text-sm mt-2 opacity-70">{result.generated_image_path}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-brand-success/5 rounded-xl border border-brand-success/20">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-brand-success" />
                      <div>
                        <div className="font-semibold text-brand-success">Image Generated Successfully</div>
                        <div className="text-sm text-muted-foreground">
                          Path: {result.generated_image_path.split('/').pop()}
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="glass hover:glass-strong shadow-md hover:shadow-lg transition-all"
                      onClick={() => {
                        if (result.generated_image_path) {
                          const link = document.createElement('a');
                          link.href = `${process.env.NEXT_PUBLIC_API_URL}/${result.generated_image_path}`;
                          link.download = result.generated_image_path.split('/').pop() || 'image.png';
                          link.click();
                        }
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Image
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center border-2 border-dashed border-border/40 rounded-xl bg-muted/20">
                  <ImageIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-lg font-medium text-muted-foreground">No image was generated</p>
                  <p className="text-sm text-muted-foreground/70 mt-2">
                    The image agent didn&apos;t create visual content for this generation
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  </>
  );
}