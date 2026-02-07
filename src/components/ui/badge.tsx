import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        
        // Risk level badges
        riskLow: "border-transparent bg-risk-low/15 text-risk-low",
        riskMedium: "border-transparent bg-risk-medium/15 text-risk-medium",
        riskHigh: "border-transparent bg-risk-high/15 text-risk-high",
        riskUnknown: "border-transparent bg-risk-unknown/15 text-risk-unknown",
        
        // Category tags
        tagDhs: "border-transparent bg-tag-dhs/15 text-tag-dhs",
        tagCourt: "border-transparent bg-tag-court/15 text-tag-court",
        tagElection: "border-transparent bg-tag-election/15 text-tag-election",
        tagInternational: "border-transparent bg-tag-international/15 text-tag-international",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
