"use client";

import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useTransition } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";

export function AppointmentSearchForm({
  defaultValue = "",
}: {
  defaultValue?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState(defaultValue);
  const debouncedValue = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (debouncedValue !== defaultValue) {
      startTransition(() => {
        const params = new URLSearchParams();
        if (debouncedValue) {
          params.set("q", debouncedValue);
        }
        router.push(`${pathname}?${params.toString()}`);
      });
    }
  }, [debouncedValue, router, pathname, defaultValue]);

  const handleClear = () => {
    setSearchQuery("");
  };

  return (
    <div className="relative flex-1 mt-2">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search appointments..."
        className="pl-8"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        disabled={isPending}
      />
      {searchQuery && !isPending && (
        <button
          type="button"
          className="absolute right-2.5 top-2.5"
          onClick={handleClear}
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
      {isPending && (
        <div className="absolute right-2.5 top-2.5">
          <div className="animate-spin h-4 w-4 border-2 border-primary border-r-transparent rounded-full"></div>
        </div>
      )}
    </div>
  );
}
