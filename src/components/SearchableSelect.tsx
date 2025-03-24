import React, { useState, useEffect, useRef } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

export type SelectItem = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SearchableSelectProps = {
  name?: string;
  placeholder?: string;
  items?: SelectItem[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (query: string) => Promise<SelectItem[]>;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  clearable?: boolean;
  loading?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  debounceMs?: number;
};

export const SearchableSelect = ({
  placeholder = "Select an item...",
  items: initialItems = [],
  defaultValue = "",
  value,
  onChange,
  onSearch,
  disabled = false,
  error,
  required = false,
  clearable = true,
  loading: externalLoading = false,
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  className,
  debounceMs = 300,
}: SearchableSelectProps) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<SelectItem[]>(initialItems || []);
  const [internalValue, setInternalValue] = useState<string>(
    value !== undefined ? value : defaultValue
  );
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialItemsRef = useRef<SelectItem[]>(initialItems || []);
  const isSearchClearedRef = useRef<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Keep track of initialItems whenever they change
  useEffect(() => {
    if (initialItems && initialItems.length > 0) {
      initialItemsRef.current = initialItems;
      setItems(initialItems);
    }
  }, [initialItems]);

  // Handle controlled component behavior
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  // Handle search with debounce, with improved clearing behavior
  const handleSearch = (query: string) => {
    setInputValue(query);

    // Cancel any pending searches
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }

    // Cancel any in-flight fetch requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // If search query is empty, immediately reset to initial items
    if (!query.trim()) {
      isSearchClearedRef.current = true;
      setItems(initialItemsRef.current);
      setLoading(false);
      return;
    }

    if (!onSearch) return;

    isSearchClearedRef.current = false;
    setLoading(true);

    // Create a new AbortController for this search
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        // Only perform the search if not aborted
        if (!signal.aborted) {
          const results = await onSearch(query);

          // Check if the search was aborted during the async call
          if (!signal.aborted) {
            setItems(Array.isArray(results) ? results : []);
            setLoading(false);
          }
        }
      } catch (error) {
        // Only update state if not aborted
        if (!signal.aborted) {
          console.error("Search error:", error);
          setItems([]);
          setLoading(false);
        }
      }
    }, debounceMs);
  };

  const handleSelect = (selectedValue: string) => {
    // Don't allow empty string as a value
    if (selectedValue === "") return;

    const newValue = selectedValue;
    setInternalValue(newValue);

    if (onChange) {
      onChange(newValue);
    }

    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInternalValue("");
    if (onChange) {
      onChange("");
    }
  };

  const getSelectedItem = () => {
    if (!internalValue) return null;

    // First check current items
    let selected = items.find((item) => item.value === internalValue);
    if (selected) return selected;

    // Then check initial items
    selected = initialItemsRef.current.find(
      (item) => item.value === internalValue
    );
    if (selected) return selected;

    return null;
  };

  const selectedItem = getSelectedItem();

  // Improved reset logic when popover closes
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);

    if (!isOpen) {
      // Cancel any pending searches when closing
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }

      // Cancel any in-flight fetch requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }

      // Reset the search state when closing
      setInputValue("");
      isSearchClearedRef.current = true;
      setLoading(false);
      setItems(initialItemsRef.current);
    }
  };

  // Cleanup timeout and abort controller on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className={cn("space-y-1.5", className)}>
      <Popover open={open && !disabled} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between",
              error && "border-destructive",
              !internalValue && "text-muted-foreground"
            )}
          >
            {selectedItem ? (
              <span className="flex items-center gap-2 truncate">
                {selectedItem.label}
              </span>
            ) : (
              placeholder
            )}
            <div className="flex">
              {internalValue && clearable && !disabled && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 mr-1 opacity-70 hover:opacity-100"
                  onClick={handleClear}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <ChevronsUpDown className="h-4 w-4 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[300px]" align="start">
          <Command shouldFilter={false}>
            {onSearch && (
              <CommandInput
                placeholder={searchPlaceholder}
                value={inputValue}
                onValueChange={handleSearch}
                className="border-none focus:ring-0"
              />
            )}
            <CommandList>
              {externalLoading || loading ? (
                <div className="p-2 space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                </div>
              ) : items.length === 0 ? (
                <CommandEmpty>{emptyMessage}</CommandEmpty>
              ) : (
                <ScrollArea className="max-h-64">
                  <CommandGroup>
                    {items.map((item) => {
                      if (!item || !item.value) return null;
                      return (
                        <CommandItem
                          key={item.value}
                          value={item.value}
                          disabled={item.disabled}
                          onSelect={handleSelect}
                          className={cn(
                            item.disabled && "opacity-50 cursor-not-allowed",
                            "flex items-center gap-2"
                          )}
                        >
                          <Check
                            className={cn(
                              "h-4 w-4",
                              internalValue === item.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {item.label || "Unnamed item"}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </ScrollArea>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};
