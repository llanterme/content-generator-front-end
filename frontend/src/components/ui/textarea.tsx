import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-muted-foreground selection:bg-accent selection:text-accent-foreground glass flex min-h-[80px] w-full rounded-xl border-2 border-transparent px-4 py-3 text-base shadow-sm transition-all duration-200 outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-accent focus-visible:ring-accent/20 focus-visible:ring-4 focus-visible:glass-strong",
        "hover:glass-strong hover:border-accent/50",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "resize-none",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
