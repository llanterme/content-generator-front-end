"use client";

import { GenerationForm } from "@/components/generation-form";
import { ProgressTracker } from "@/components/progress-tracker";
import { ResultsDisplay } from "@/components/results-display";

export default function GeneratePage() {
  return (
    <div className="min-h-screen dashboard-bg">
      <div className="space-y-8">
        {/* Generation Form */}
        <section>
          <GenerationForm />
        </section>

        {/* Progress Tracking */}
        <section>
          <ProgressTracker />
        </section>

        {/* Results Display */}
        <section>
          <ResultsDisplay />
        </section>
      </div>
    </div>
  );
}