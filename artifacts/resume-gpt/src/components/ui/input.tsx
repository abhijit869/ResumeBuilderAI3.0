import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-white/10 bg-black/40 px-3 py-1 text-sm text-white shadow-sm transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-blue-100/30 focus-visible:outline-none focus-visible:bg-black/60 focus-visible:border-primary/50 focus-visible:shadow-[0_0_15px_rgba(0,229,255,0.2)] disabled:cursor-not-allowed disabled:opacity-50 hover:bg-black/50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
