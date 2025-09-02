"use client";

import { useState } from "react";
import * as React from "react";
import { 
  Brain, 
  Zap, 
  Image as ImageIcon, 
  TrendingUp, 
  Clock, 
  Target,
  Sparkles,
  BarChart3,
  Activity,
  Users,
  ArrowRight,
  Plus
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GenerationForm } from "@/components/generation-form";
import { ProgressTracker } from "@/components/progress-tracker";
import { ResultsDisplay } from "@/components/results-display";
import { useGenerationStore } from "@/lib/stores/generation-store";
import { useHistoryStore } from "@/lib/stores/history-store";
import { formatTimestamp, truncateText } from "@/lib/utils";
import Link from "next/link";

const stats = [
  {
    title: "Total Generations",
    value: "1,248",
    change: "+12%",
    changeType: "positive" as const,
    icon: Target,
  },
  {
    title: "Success Rate",
    value: "99.2%",
    change: "+0.3%", 
    changeType: "positive" as const,
    icon: TrendingUp,
  },
  {
    title: "Avg. Generation Time",
    value: "24.8s",
    change: "-2.1s",
    changeType: "positive" as const,
    icon: Clock,
  },
  {
    title: "Active Users",
    value: "47",
    change: "+5",
    changeType: "positive" as const,
    icon: Users,
  },
];


export default function DashboardHome() {
  const { generationState } = useGenerationStore();
  const { history, loadHistory } = useHistoryStore();
  const [showGenerationForm, setShowGenerationForm] = useState(false);

  // Load history on component mount
  React.useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleGenerationSubmit = () => {
    // Form submission is handled within the component
  };

  // Get recent activity from history (last 3 items)
  const recentActivity = history
    .slice(0, 3)
    .map((item) => ({
      type: "generation",
      title: truncateText(item.response.topic, 50),
      time: formatTimestamp(item.timestamp),
      status: item.response.success ? "completed" : "failed",
      platform: item.response.platform,
      id: item.id
    }));

  return (
    <div className="flex-1 space-y-6 p-6 pb-16">
      {/* Welcome Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight gradient-hero bg-clip-text text-transparent">
          Welcome to ContentAI Pro
        </h1>
        <p className="text-muted-foreground text-lg">
          Professional multi-agent content generation at your fingertips
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={stat.title} className="glass-strong animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${
                stat.changeType === "positive" ? "text-green-600" : "text-red-600"
              }`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Generation Section */}
        <div className="xl:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card className="glass-strong">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Start generating content with our AI agents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showGenerationForm ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button 
                    onClick={() => setShowGenerationForm(true)}
                    className="h-20 sm:h-24 flex-col space-y-2 gradient-primary hover:shadow-elevated transition-all"
                    size="lg"
                  >
                    <Plus className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-semibold">New Generation</div>
                      <div className="text-sm opacity-90">Create AI content</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 sm:h-24 flex-col space-y-2 glass hover:glass-strong transition-all"
                    size="lg"
                  >
                    <BarChart3 className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-semibold">Analytics</div>
                      <div className="text-sm text-muted-foreground">View insights</div>
                    </div>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Generate New Content</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowGenerationForm(false)}
                    >
                      Close
                    </Button>
                  </div>
                  <GenerationForm onSubmit={handleGenerationSubmit} />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress Section */}
          {(generationState.isGenerating || generationState.result) && (
            <ProgressTracker />
          )}

          {/* Results Section */}
          {generationState.result && (
            <ResultsDisplay />
          )}

          {/* Recent Activity */}
          <Card className="glass-strong">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/history">
                    View all
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div 
                    key={activity.id || index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === "completed" 
                          ? "bg-brand-success animate-pulse" 
                          : "bg-brand-error"
                      }`} />
                      <div>
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.platform} • {activity.time}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        activity.status === "completed"
                          ? "text-brand-success border-brand-success/20 bg-brand-success/5"
                          : "text-brand-error border-brand-error/20 bg-brand-error/5"
                      }`}
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity</p>
                  <p className="text-sm">Generate some content to see activity here!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* AI Agents Status */}
          <Card className="glass-strong animate-slide-in-right">
            <CardHeader>
              <CardTitle className="text-lg">AI Agents Status</CardTitle>
              <CardDescription>Multi-agent system performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { name: "Research Agent", icon: Brain, performance: 98, status: "Optimal" },
                { name: "Content Agent", icon: Zap, performance: 96, status: "Excellent" },
                { name: "Image Agent", icon: ImageIcon, performance: 94, status: "Good" }
              ].map((agent) => (
                <div key={agent.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <agent.icon className="h-4 w-4 text-brand-accent" />
                      <span className="text-sm font-medium">{agent.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {agent.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Performance</span>
                      <span>{agent.performance}%</span>
                    </div>
                    <Progress value={agent.performance} className="h-2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="glass-strong">
            <CardHeader>
              <CardTitle className="text-lg">System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { metric: "API Response Time", value: "124ms", status: "good" },
                { metric: "Queue Processing", value: "2.1s", status: "good" },
                { metric: "Error Rate", value: "0.02%", status: "excellent" },
                { metric: "Uptime", value: "99.98%", status: "excellent" }
              ].map((metric) => (
                <div key={metric.metric} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{metric.metric}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{metric.value}</span>
                    <div className={`w-2 h-2 rounded-full ${
                      metric.status === "excellent" ? "bg-brand-success" :
                      metric.status === "good" ? "bg-brand-warning" :
                      "bg-brand-error"
                    }`} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="glass-strong gradient-accent text-white">
            <CardHeader>
              <CardTitle className="text-white">Today&apos;s Impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/80">Content Generated</span>
                <span className="text-xl font-bold">47</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Time Saved</span>
                <span className="text-xl font-bold">18.2hrs</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">User Satisfaction</span>
                <span className="text-xl font-bold">4.9★</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
