'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';

interface SearchFilters {
  category?: string;
  level?: string;
  price?: 'free' | 'paid';
  duration?: string;
  rating?: number;
}

export function AdvancedSearch() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSearch = async () => {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        filters,
        sort: {
          field: sortBy,
          order: sortOrder
        }
      })
    });
    // Handle response...
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search courses..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSearch}>
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Select
          value={filters.category}
          onValueChange={(value) => setFilters({ ...filters, category: value })}
          placeholder="Category"
        />
        <Select
          value={filters.level}
          onValueChange={(value) => setFilters({ ...filters, level: value })}
          placeholder="Level"
        />
        <Select
          value={filters.price}
          onValueChange={(value: 'free' | 'paid') => setFilters({ ...filters, price: value })}
          placeholder="Price"
        />
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={sortBy}
          onValueChange={setSortBy}
          placeholder="Sort by"
        />
        <Button
          variant="outline"
          onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
        >
          {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
        </Button>
      </div>
    </Card>
  );
} 