import { forwardRef, type ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger"
  size?: "sm" | "md" | "lg"
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-pink-600 text-white hover:bg-pink-700 focus:ring-pink-500":
              variant === "primary",
            "bg-zinc-900 text-white hover:bg-zinc-800 focus:ring-zinc-500 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200":
              variant === "secondary",
            "border border-zinc-300 bg-transparent hover:bg-zinc-50 focus:ring-zinc-500 dark:border-zinc-700 dark:hover:bg-zinc-800":
              variant === "outline",
            "bg-transparent hover:bg-zinc-100 focus:ring-zinc-500 dark:hover:bg-zinc-800":
              variant === "ghost",
            "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500":
              variant === "danger",
          },
          {
            "h-8 px-3 text-sm": size === "sm",
            "h-10 px-4 text-sm": size === "md",
            "h-12 px-6 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
