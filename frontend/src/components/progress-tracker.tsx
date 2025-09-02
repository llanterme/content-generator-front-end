"use client";

import { Search, PenTool, Image, CheckCircle, AlertCircle, Activity } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useGenerationStore } from "@/lib/stores/generation-store";
import { cn } from "@/lib/utils";

const steps = [
  {
    id: "research",
    label: "Research",
    description: "Gathering information and creating bullet points",
    icon: Search,
  },
  {
    id: "content",
    label: "Content",
    description: "Writing platform-optimized content",
    icon: PenTool,
  },
  {
    id: "image",
    label: "Image",
    description: "Generating visual content",
    icon: Image,
  },
];

export function ProgressTracker() {
  const { generationState } = useGenerationStore();

  // Note: WebSocket lifecycle is managed by the generation process itself
  // No need to manage it in this component

  if (!generationState.isGenerating && !generationState.result) {
    return null;
  }

  const getCurrentStepIndex = () => {
    const currentStep = generationState.currentStep?.toLowerCase() || "";
    
    if (currentStep.includes("research")) return 0;
    if (currentStep.includes("content")) return 1;
    if (currentStep.includes("image")) return 2;
    if (generationState.progress === 100) return 3;
    
    return -1;
  };

  const currentStepIndex = getCurrentStepIndex();
  const hasError = !!generationState.error;

  return (
    <Card className="w-full glass-strong shadow-elevated border-0 animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl">Generation Progress</span>
          </div>
          <Badge 
            variant={hasError ? "destructive" : generationState.progress === 100 ? "default" : "secondary"}
            className="px-3 py-1 font-medium"
          >
            {hasError ? "Error" : generationState.progress === 100 ? "Complete" : "In Progress"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold">Overall Progress</span>
            <div className="text-2xl font-bold text-brand-accent">
              {generationState.progress}%
            </div>
          </div>
          <Progress 
            value={generationState.progress} 
            className="h-4 bg-muted/50 rounded-full border border-border/20" 
          />
        </div>

        {/* Current Step Message */}
        {generationState.currentStep && (
          <div className={cn(
            "p-4 rounded-xl border-2 transition-all duration-300",
            hasError 
              ? "bg-brand-error/5 border-brand-error/20 text-brand-error" 
              : generationState.progress === 100
              ? "bg-brand-success/5 border-brand-success/20 text-brand-success"
              : "bg-brand-accent/5 border-brand-accent/20 text-brand-accent"
          )}>
            <div className="flex items-center gap-3">
              {hasError ? (
                <AlertCircle className="h-5 w-5" />
              ) : generationState.progress === 100 ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <div className="relative">
                  <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <div className="absolute inset-0 h-5 w-5 border-2 border-current/20 rounded-full" />
                </div>
              )}
              <div>
                <div className="font-semibold text-base">
                  {generationState.currentStep}
                </div>
                {generationState.error && (
                  <div className="mt-1 text-sm opacity-80">
                    {generationState.error}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step Indicators */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold">AI Agent Status</h3>
          <div className="space-y-4">
            {steps.map((step, index) => {
              const isCompleted = index < currentStepIndex || generationState.progress === 100;
              const isCurrent = index === currentStepIndex && generationState.isGenerating;
              const isError = hasError && index === currentStepIndex;

              const StepIcon = step.icon;

              return (
                <div 
                  key={step.id} 
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border transition-all duration-300",
                    isCompleted 
                      ? "bg-brand-success/5 border-brand-success/20" 
                      : isCurrent
                      ? "bg-brand-accent/5 border-brand-accent/20 shadow-lg"
                      : isError
                      ? "bg-brand-error/5 border-brand-error/20"
                      : "bg-muted/20 border-border/40"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl border-2 transition-all duration-300",
                      isCompleted
                        ? "border-brand-success bg-brand-success text-white shadow-lg"
                        : isCurrent
                        ? "border-brand-accent bg-brand-accent text-white shadow-lg animate-pulse-slow"
                        : isError
                        ? "border-brand-error bg-brand-error text-white"
                        : "border-border bg-muted"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : isError ? (
                      <AlertCircle className="h-5 w-5" />
                    ) : (
                      <StepIcon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "font-semibold text-base",
                          isCompleted || isCurrent
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {step.label} Agent
                      </span>
                      {isCurrent && !isError && (
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-brand-accent animate-pulse" />
                          <div className="h-2 w-2 rounded-full bg-brand-accent animate-pulse" style={{ animationDelay: "0.3s" }} />
                          <div className="h-2 w-2 rounded-full bg-brand-accent animate-pulse" style={{ animationDelay: "0.6s" }} />
                        </div>
                      )}
                      {isCompleted && (
                        <Badge variant="outline" className="text-xs bg-brand-success/10 text-brand-success border-brand-success/20">
                          Complete
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Execution Time */}
        {generationState.result && (
          <div className="pt-6 border-t border-border/40">
            <div className="flex items-center justify-between p-4 rounded-xl bg-brand-success/5 border border-brand-success/20">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-brand-success" />
                <div>
                  <div className="font-semibold text-brand-success">Generation Complete!</div>
                  <div className="text-sm text-muted-foreground">
                    All AI agents finished successfully
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-brand-success">
                  {generationState.result.execution_time_seconds.toFixed(1)}s
                </div>
                <div className="text-xs text-muted-foreground">
                  Total time
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}