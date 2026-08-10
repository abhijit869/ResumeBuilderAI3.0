import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white shadow-sm transition-all duration-300 placeholder:text-blue-100/30 focus-visible:outline-none focus-visible:bg-black/60 focus-visible:border-primary/50 focus-visible:shadow-[0_0_15px_rgba(0,229,255,0.2)] disabled:cursor-not-allowed disabled:opacity-50 hover:bg-black/50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
