import { cn } from "@/lib/utils"
import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn("animate-pulse rounded-md bg-primary/10", className)}
        ref={ref}
        {...props} />
    );
  }
)

Skeleton.displayName = "Skeleton"

export { Skeleton }
