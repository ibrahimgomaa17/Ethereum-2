import { Search } from "lucide-react"

import { Label } from "@/components/ui/label"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "@/components/ui/sidebar"
interface SearchFormProps {
  searchQuery: (term: string) => void;
  className?: string;
}
export function SearchForm({ searchQuery, className  }: SearchFormProps) {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    searchQuery(event.target.value);
  };
  return (
    <SidebarGroup className="py-0 max-w-60">
      <SidebarGroupContent className="relative">
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <SidebarInput
          id="search"
          placeholder="Search ..."
          className="pl-8"
          onChange={handleSearch} 
        />
        <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
