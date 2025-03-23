"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

export function AppointmentSearchForm({ defaultValue = "" }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(defaultValue);

  const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery) {
      router.push(`/appointments?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/appointments");
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    router.push("/appointments");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full  items-center space-x-2"
    >
      <div className="relative w-full">
        <Input
          type="text"
          placeholder="Search appointments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10 "
        />
        {searchQuery && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button type="submit" variant="secondary" size="icon">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
}
