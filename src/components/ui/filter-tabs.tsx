import * as React from "react"
import { cn } from "@/lib/utils"

interface FilterTabsProps {
  items: string[]
  activeItem: string
  onItemChange: (item: string) => void
  className?: string
}

const FilterTabs = ({ items, activeItem, onItemChange, className }: FilterTabsProps) => {
  return (
    <div className={cn("flex items-center space-x-8 border-b border-border", className)}>
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onItemChange(item)}
          className={cn(
            "pb-4 px-1 text-sm font-medium transition-colors relative",
            activeItem === item
              ? "text-foreground border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {item}
        </button>
      ))}
    </div>
  )
}

export { FilterTabs }