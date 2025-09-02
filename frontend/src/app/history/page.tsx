"use client";

import { HistoryGallery } from "@/components/history-gallery";

export default function HistoryPage() {
  return (
    <div className="min-h-screen dashboard-bg">
      <div className="space-y-8">
        <HistoryGallery />
      </div>
    </div>
  );
}