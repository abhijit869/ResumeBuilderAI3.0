import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:bg-primary/90 hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] hover:-translate-y-0.5",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:bg-destructive/90 hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] hover:-translate-y-0.5",
        outline:
          "border border-white/20 bg-black/20 shadow-sm hover:bg-white/10 hover:text-white backdrop-blur-sm hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:-translate-y-0.5",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:-translate-y-0.5",
        ghost: "hover:bg-white/10 hover:text-white transition-colors",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
        glass: "bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:-translate-y-0.5",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
