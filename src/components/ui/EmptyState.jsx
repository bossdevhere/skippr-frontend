import React from "react"
import { Inbox } from "lucide-react"
import { cn } from "@/utils/cn"

const EmptyState = ({ 
  icon: Icon = Inbox, 
  title = "No data found", 
  description = "There are no items to display at the moment.",
  action,
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-xl", className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export { EmptyState }
