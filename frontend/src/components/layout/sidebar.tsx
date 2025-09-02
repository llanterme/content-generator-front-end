"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Sparkles, 
  History, 
  BarChart3,
  Settings,
  ChevronLeft,
  Activity,
  HelpCircle,
  Menu,
  X
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useGenerationStore } from "@/lib/stores/generation-store";

// Navigation items
const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: BarChart3,
    description: "Overview and analytics",
    badge: null
  },
  {
    name: "Generate",
    href: "/generate",
    icon: Sparkles,
    description: "Create new content",
    badge: null
  },
  {
    name: "History",
    href: "/history",
    icon: History,
    description: "View past generations",
    badge: "results"
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Configure preferences",
    badge: null
  }
];


interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ 
  isCollapsed = false, 
  onToggleCollapse,
  isMobileOpen = false,
  onMobileClose 
}: SidebarProps) {
  const pathname = usePathname();
  const { generationState } = useGenerationStore();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const getBadgeContent = (badgeType: string | null) => {
    if (badgeType === "results" && generationState.result) {
      return "1";
    }
    return null;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out",
          "glass-sidebar border-r border-sidebar-border/60 shadow-2xl",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-sidebar-border/40">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg gradient-hero flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-0.5">
                <h1 className="text-lg font-bold text-sidebar-foreground leading-tight">ContentAI Pro</h1>
                <p className="text-xs text-sidebar-foreground/60 leading-none">AI-Powered Creation</p>
              </div>
            </div>
          )}
          
          {/* Desktop collapse button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="hidden lg:flex text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/60"
          >
            <ChevronLeft className={cn(
              "w-4 h-4 transition-transform duration-200",
              isCollapsed && "rotate-180"
            )} />
          </Button>
          
          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMobileClose}
            className="lg:hidden text-sidebar-foreground/60 hover:text-sidebar-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const badgeContent = getBadgeContent(item.badge);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                  "hover:bg-sidebar-accent/80 hover:shadow-md relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg ring-1 ring-sidebar-ring/20" 
                    : "text-sidebar-foreground hover:text-sidebar-accent-foreground"
                )}
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <item.icon className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isCollapsed ? "" : "mr-3"
                )} />
                
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {badgeContent && (
                      <Badge 
                        variant="secondary" 
                        className="ml-2 text-xs px-2 py-0.5 bg-sidebar-accent/60 text-sidebar-accent-foreground border-0"
                      >
                        {badgeContent}
                      </Badge>
                    )}
                  </>
                )}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && hoveredItem === item.name && (
                  <div className="absolute left-full ml-3 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-lg shadow-xl border z-50 animate-fade-in">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {item.description}
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>


        {/* Footer */}
        <div className="border-t border-sidebar-border/40 p-5 mt-auto">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-xs text-sidebar-foreground/80 font-medium leading-none">
                  System Status
                </p>
                <p className="text-xs text-sidebar-foreground/60 flex items-center">
                  <Activity className="w-3 h-3 mr-1.5 text-green-500" />
                  All systems operational
                </p>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="shrink-0 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/60"
            >
              {isCollapsed ? (
                <HelpCircle className="w-4 h-4" />
              ) : (
                <>
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Help
                </>
              )}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}

// Mobile menu button component
export function MobileSidebarButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="lg:hidden"
      onClick={onClick}
    >
      <Menu className="w-5 h-5" />
    </Button>
  );
}