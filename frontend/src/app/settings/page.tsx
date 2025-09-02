"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  Palette, 
  Bell, 
  Shield, 
  Database,
  Zap,
  Globe
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen dashboard-bg">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center shadow-lg">
            <SettingsIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Configure your ContentAI Pro preferences</p>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Theme Settings */}
          <Card className="glass-strong">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-accent/10 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-brand-accent" />
                </div>
                <div>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize the look and feel</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Theme</span>
                <Badge variant="secondary">Auto</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sidebar</span>
                <Badge variant="secondary">Expanded</Badge>
              </div>
              <Button variant="outline" className="w-full">
                Customize Theme
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="glass-strong">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-success/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-brand-success" />
                </div>
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Manage your alerts and updates</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Generation Complete</span>
                <Badge variant="default">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">System Updates</span>
                <Badge variant="default">Enabled</Badge>
              </div>
              <Button variant="outline" className="w-full">
                Configure Alerts
              </Button>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="glass-strong">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-warning/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-brand-warning" />
                </div>
                <div>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Account and data protection</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Two-Factor Auth</span>
                <Badge variant="outline">Setup Required</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API Access</span>
                <Badge variant="secondary">Limited</Badge>
              </div>
              <Button variant="outline" className="w-full">
                Security Settings
              </Button>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="glass-strong">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-accent/10 flex items-center justify-center">
                  <Database className="w-5 h-5 text-brand-accent" />
                </div>
                <div>
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>Storage and backup options</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Storage Used</span>
                <Badge variant="secondary">2.4 GB</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Auto Backup</span>
                <Badge variant="default">Enabled</Badge>
              </div>
              <Button variant="outline" className="w-full">
                Manage Storage
              </Button>
            </CardContent>
          </Card>

          {/* Performance Settings */}
          <Card className="glass-strong">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-highlight/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-brand-highlight" />
                </div>
                <div>
                  <CardTitle>Performance</CardTitle>
                  <CardDescription>Speed and optimization settings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Generation Speed</span>
                <Badge variant="secondary">Balanced</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Image Quality</span>
                <Badge variant="secondary">High</Badge>
              </div>
              <Button variant="outline" className="w-full">
                Optimize Settings
              </Button>
            </CardContent>
          </Card>

          {/* Integration Settings */}
          <Card className="glass-strong">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-success/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-brand-success" />
                </div>
                <div>
                  <CardTitle>Integrations</CardTitle>
                  <CardDescription>Connected services and APIs</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">LinkedIn</span>
                <Badge variant="default">Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Twitter/X</span>
                <Badge variant="outline">Not Connected</Badge>
              </div>
              <Button variant="outline" className="w-full">
                Manage Integrations
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="flex-1 gradient-primary text-white">
            Save All Settings
          </Button>
          <Button variant="outline" className="flex-1">
            Reset to Defaults
          </Button>
        </div>
      </div>
    </div>
  );
}