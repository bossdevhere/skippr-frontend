import React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/utils/cn"

const LoadingState = ({ message = "Loading...", className }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12", className)}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  )
}

export { LoadingState }
