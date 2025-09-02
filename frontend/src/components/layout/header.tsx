"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Bell,
  Search,
  Settings,
  User,
  Moon,
  Sun,
  Activity,
  AlertCircle,
  CheckCircle,
  Wifi,
  WifiOff,
  Zap
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MobileSidebarButton } from "./sidebar";
import { apiClient, queryKeys } from "@/lib/api";
import { useGenerationStore } from "@/lib/stores/generation-store";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onMobileSidebarOpen: () => void;
  isCollapsed?: boolean;
}

export function Header({ onMobileSidebarOpen, isCollapsed = false }: HeaderProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { generationState } = useGenerationStore();
  
  // Health check query
  const { data: healthData, isError: healthError, isLoading: healthLoading } = useQuery({
    queryKey: queryKeys.health,
    queryFn: apiClient.getHealth,
    refetchInterval: 30000, // Check every 30 seconds
    retry: 1,
  });

  // Status query
  const { isError: statusError } = useQuery({
    queryKey: queryKeys.status,
    queryFn: apiClient.getStatus,
    refetchInterval: 15000, // Check every 15 seconds
    retry: 1,
  });

  // Theme toggle
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const getSystemStatus = () => {
    if (healthError || statusError) {
      return { status: "error", label: "Offline", icon: WifiOff };
    }
    if (healthLoading) {
      return { status: "loading", label: "Checking...", icon: Activity };
    }
    if (healthData?.status === "healthy") {
      return { status: "online", label: "Online", icon: Wifi };
    }
    return { status: "warning", label: "Warning", icon: AlertCircle };
  };

  const systemStatus = getSystemStatus();

  return (
    <header 
      className={cn(
        "sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm shadow-sm transition-all duration-300",
        isCollapsed ? "lg:pl-20" : "lg:pl-68"
      )}
      role="banner"
    >
      <div className="flex h-16 items-center justify-between px-4 lg:px-6" role="toolbar" aria-label="Application header">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <MobileSidebarButton onClick={onMobileSidebarOpen} />
          
          {/* System Status Indicator */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-muted/50">
              <systemStatus.icon className={cn(
                "w-4 h-4",
                systemStatus.status === "online" && "text-brand-success",
                systemStatus.status === "error" && "text-brand-error", 
                systemStatus.status === "warning" && "text-brand-warning",
                systemStatus.status === "loading" && "text-muted-foreground animate-pulse"
              )} />
              <span className="text-sm font-medium">
                {systemStatus.label}
              </span>
            </div>
            
            {/* Generation Status */}
            {generationState.isGenerating && (
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-brand-accent/10 text-brand-accent">
                <Zap className="w-4 h-4 animate-pulse" />
                <span className="text-sm font-medium">
                  Generating...
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Center - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search content, history..."
              className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
              aria-label="Search content and history"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          {/* Performance Stats */}
          {generationState.result && (
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-brand-success/10 text-brand-success">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">
                {generationState.result.execution_time_seconds.toFixed(1)}s
              </span>
            </div>
          )}

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative"
            aria-label="View notifications (2 unread)"
          >
            <Bell className="h-4 w-4" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
              aria-label="2 unread notifications"
            >
              2
            </Badge>
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">Content Creator</p>
                  <p className="text-sm text-muted-foreground">creator@company.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Activity className="mr-2 h-4 w-4" />
                Usage Analytics
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-10 bg-muted/50 border-0"
          />
        </div>
      </div>

      {/* Mobile status indicators */}
      <div className="md:hidden px-4 pb-2">
        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 px-2 py-1 rounded-md bg-muted/50">
              <systemStatus.icon className={cn(
                "w-3 h-3",
                systemStatus.status === "online" && "text-brand-success",
                systemStatus.status === "error" && "text-brand-error",
                systemStatus.status === "warning" && "text-brand-warning",
                systemStatus.status === "loading" && "text-muted-foreground animate-pulse"
              )} />
              <span className="text-xs">
                {systemStatus.label}
              </span>
            </div>
          </div>
          
          {generationState.isGenerating && (
            <div className="flex items-center space-x-1 px-2 py-1 rounded-md bg-brand-accent/10 text-brand-accent">
              <Zap className="w-3 h-3 animate-pulse" />
              <span className="text-xs">Generating</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}