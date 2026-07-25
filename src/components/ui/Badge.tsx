import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "success"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200":
            variant === "default",
          "border border-zinc-300 text-zinc-700 dark:border-zinc-600 dark:text-zinc-300":
            variant === "outline",
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200":
            variant === "success",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
