import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:scale-95 hover:shadow-lg",
  {
    variants: {
      variant: {
        default:
          "gradient-primary text-primary-foreground shadow-md hover:shadow-xl hover:scale-105 active:scale-95",
        destructive:
          "bg-destructive text-white shadow-md hover:bg-destructive/90 hover:shadow-xl hover:scale-105 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "glass border-2 hover:glass-strong hover:scale-105 hover:border-accent/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/80 hover:shadow-xl hover:scale-105",
        ghost:
          "hover:glass hover:scale-105 active:scale-95",
        link: "text-accent underline-offset-4 hover:underline hover:text-accent/80",
        accent:
          "gradient-accent text-accent-foreground shadow-md hover:shadow-xl hover:scale-105 animate-glow",
      },
      size: {
        default: "h-11 px-6 py-3 has-[>svg]:px-4",
        sm: "h-9 rounded-lg gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-13 rounded-xl px-8 has-[>svg]:px-6 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
