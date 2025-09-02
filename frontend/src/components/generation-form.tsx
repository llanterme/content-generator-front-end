"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Sparkles, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { apiClient, queryKeys } from "@/lib/api";
import { FormData } from "@/lib/types";
import { useGenerationStore } from "@/lib/stores/generation-store";

// Fallback data for when backend is not available
const fallbackPlatforms = {
  platforms: [
    {
      name: "blog_post",
      display_name: "Blog Post", 
      description: "Long-form blog content",
      max_length: 2000
    },
    {
      name: "linkedin",
      display_name: "LinkedIn Post",
      description: "Professional social media content",
      max_length: 1300
    },
    {
      name: "twitter",
      display_name: "Twitter/X Post", 
      description: "Short-form social media content",
      max_length: 280
    }
  ]
};

const fallbackTones = {
  tones: [
    {
      name: "informative",
      display_name: "Informative",
      description: "Educational, fact-focused, clear explanations"
    },
    {
      name: "professional",
      display_name: "Professional", 
      description: "Business-appropriate, formal tone"
    },
    {
      name: "casual",
      display_name: "Casual",
      description: "Friendly, conversational, approachable"
    }
  ]
};

const formSchema = z.object({
  topic: z
    .string()
    .min(3, "Topic must be at least 3 characters long")
    .max(100, "Topic must be less than 100 characters"),
  platform: z.string().min(1, "Please select a platform"),
  tone: z.string().min(1, "Please select a tone"),
});

interface GenerationFormProps {
  onSubmit?: (data: FormData) => void;
}

export function GenerationForm({ onSubmit }: GenerationFormProps) {
  const { generationState, startGeneration } = useGenerationStore();
  
  // Fetch platforms and tones
  const { data: platformsData, isLoading: loadingPlatforms, error: platformsError } = useQuery({
    queryKey: queryKeys.platforms,
    queryFn: apiClient.getPlatforms,
  });

  const { data: tonesData, isLoading: loadingTones, error: tonesError } = useQuery({
    queryKey: queryKeys.tones,
    queryFn: apiClient.getTones,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      platform: "",
      tone: "",
    },
  });

  const handleSubmit = (data: FormData) => {
    startGeneration(data);
    onSubmit?.(data);
  };

  const isLoading = generationState.isGenerating || loadingPlatforms || loadingTones;
  const hasConnectionError = platformsError || tonesError;
  
  // Use fallback data when backend is not available
  const platforms = platformsData || (hasConnectionError ? fallbackPlatforms : null);
  const tones = tonesData || (hasConnectionError ? fallbackTones : null);

  return (
    <Card className="w-full glass-strong shadow-elevated border-0">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          Generate Content
        </CardTitle>
        <CardDescription className="text-base">
          Create AI-powered content with research, writing, and image generation
        </CardDescription>
        {hasConnectionError && (
          <div className="mt-4 p-4 bg-brand-error/10 border border-brand-error/20 rounded-lg animate-fade-in">
            <div className="flex items-center gap-3 text-brand-error">
              <AlertCircle className="h-5 w-5" />
              <div>
                <div className="font-medium">Backend Server Offline</div>
                <div className="text-sm">Using fallback data for testing. Start the backend server on http://localhost:8000 for full functionality.</div>
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base font-semibold">Content Topic</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your topic (e.g., artificial intelligence, climate change, productivity tips)"
                      className="h-12 text-base bg-background/50 border-border/60 focus:border-brand-accent focus:ring-brand-accent/20"
                      {...field}
                      disabled={generationState.isGenerating}
                    />
                  </FormControl>
                  <FormDescription className="text-sm">
                    What would you like to create content about? Be specific for better results.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-base font-semibold">Target Platform</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading || (!platforms && !hasConnectionError)}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Choose platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-w-[400px]">
                        {platforms?.platforms.map((platform) => (
                          <SelectItem key={platform.name} value={platform.name} className="py-3">
                            <div className="flex flex-col space-y-1">
                              <span className="font-medium">{platform.display_name}</span>
                              <span className="text-xs text-muted-foreground leading-relaxed">
                                {platform.description}
                                {platform.max_length && ` • Max ${platform.max_length} chars`}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-sm">
                      Where will this content be published?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tone"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-base font-semibold">Content Tone</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading || (!tones && !hasConnectionError)}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Choose tone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-w-[400px]">
                        {tones?.tones.map((tone) => (
                          <SelectItem key={tone.name} value={tone.name} className="py-3">
                            <div className="flex flex-col space-y-1">
                              <span className="font-medium">{tone.display_name}</span>
                              <span className="text-xs text-muted-foreground leading-relaxed">
                                {tone.description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-sm">
                      What style should the content have?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-4 border-t border-border/40">
              <Button
                type="submit"
                className="w-full h-14 text-lg font-semibold gradient-primary hover:shadow-elevated disabled:opacity-60 transition-all duration-200"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <div>
                      <div className="font-semibold">Generating Content...</div>
                      <div className="text-sm opacity-90">
                        {generationState.currentStep || "Initializing..."}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-3">
                    <Sparkles className="h-5 w-5" />
                    <span>Generate AI Content</span>
                  </div>
                )}
              </Button>
              
              {!isLoading && (
                <p className="text-sm text-muted-foreground text-center mt-3">
                  Our AI agents will research, write, and create visuals for your content
                </p>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}