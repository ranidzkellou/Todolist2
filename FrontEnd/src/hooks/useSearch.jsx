import { useState, useEffect } from 'react';

function useSearch(items, searchKeys = ['name', 'description']) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(items);

  useEffect(() => {
    if (!query || !query.trim()) {
      setResults(items);
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    const filtered = items.filter(item =>
      item.title.toLowerCase().includes(searchTerm) ||
      item.subtasks.some(subtask => 
        subtask.title.toLowerCase().includes(searchTerm)
      )
    );
    
    setResults(filtered);
  }, [query, items, searchKeys]);

  return {
    query,
    setQuery,
    results: query.trim() ? results : items,
  };
}

export default useSearch;