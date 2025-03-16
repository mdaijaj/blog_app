"use client";
import * as React from "react";
import * as ShadSelect from "@radix-ui/react-select"; // Correct import

export const Select = ShadSelect.Select;
export const SelectContent = ShadSelect.Content;
export const SelectItem = ShadSelect.Item;
export const SelectTrigger = ShadSelect.Trigger;
export const SelectValue = ShadSelect.Value;

interface SelectionProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Selection = React.forwardRef<HTMLSelectElement, SelectionProps>(({ className, ...props }, ref) => (
  <select ref={ref} className={cn("block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md", className)} {...props} />
))
Selection.displayName = "Selection"

export { Selection }
