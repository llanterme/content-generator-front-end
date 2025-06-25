"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Sparkles, History, Activity } from "lucide-react";
import { Motion, Stagger } from "@/components/ui/motion";

import { GenerationForm } from "@/components/generation-form";
import { ProgressTracker } from "@/components/progress-tracker";
import { ResultsDisplay } from "@/components/results-display";
import { HistoryGallery } from "@/components/history-gallery";
import { useGenerationStore } from "@/lib/stores/generation-store";

export default function Home() {
  const { generationState } = useGenerationStore();
  const [activeTab, setActiveTab] = useState("generate");

  // Keep user on current tab - they can manually switch to see results
  const handleGenerationSubmit = () => {
    // Don't auto-navigate - let user see progress on Generate tab
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <Motion variant="fadeInUp" className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground drop-shadow-lg animate-float">
            <span className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent bg-clip-text text-transparent">
              Multi-Agent Content Generator
            </span>
          </h1>
          <Motion variant="fadeIn" delay={0.2}>
            <p className="text-xl text-foreground/80 mt-4 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-sm">
              AI-powered content generation with research, writing, and image creation
            </p>
          </Motion>
          <Stagger staggerDelay={0.1} className="flex justify-center gap-3 mt-6">
            <Motion variant="scaleIn">
              <Badge variant="secondary" className="glass-strong px-4 py-2 text-sm font-medium text-foreground border border-brand-accent/30">Research Agent</Badge>
            </Motion>
            <Motion variant="scaleIn">
              <Badge variant="secondary" className="glass-strong px-4 py-2 text-sm font-medium text-foreground border border-brand-accent/30">Content Agent</Badge>
            </Motion>
            <Motion variant="scaleIn">
              <Badge variant="secondary" className="glass-strong px-4 py-2 text-sm font-medium text-foreground border border-brand-accent/30">Image Agent</Badge>
            </Motion>
          </Stagger>
        </Motion>

        {/* Main Content */}
        <Motion variant="fadeInUp" delay={0.4}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="generate" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Generate
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Results
                {generationState.result && (
                  <Badge variant="outline" className="ml-1 glass">
                    New
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                History
              </TabsTrigger>
            </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              <div className="flex-1 w-full">
                <GenerationForm onSubmit={handleGenerationSubmit} />
              </div>
              <div className="flex-1 w-full">
                <ProgressTracker />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <div className="flex justify-center">
              {generationState.result ? (
                <ResultsDisplay />
              ) : (
                <Card className="w-full max-w-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      No Results Yet
                    </CardTitle>
                    <CardDescription>
                      Generate some content to see results here
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Start by generating your first piece of content!</p>
                      <p className="text-sm mt-2">
                        Use the Generate tab to create AI-powered content with research and images.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="flex justify-center">
              <HistoryGallery />
            </div>
          </TabsContent>
          </Tabs>
        </Motion>

        {/* Error Display */}
        {generationState.error && (
          <Motion variant="scaleIn" delay={0.2}>
            <Card className="mt-6 border-2 border-destructive/50 glass-strong">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">Generation Error</span>
                </div>
                <p className="mt-2 text-sm">{generationState.error}</p>
              </CardContent>
            </Card>
          </Motion>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Powered by{" "}
            <span className="font-medium">PydanticAI</span>,{" "}
            <span className="font-medium">LangGraph</span>, and{" "}
            <span className="font-medium">OpenAI</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
