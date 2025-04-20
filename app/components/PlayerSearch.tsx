'use client';

import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../hooks/useDebounce';

interface Player {
  player_id: string;
  player_display_name: string;
  recent_team: string;  // Keep this for validation but don't display it
}

interface PlayerSearchProps {
  onSelect: (player: Player) => void;
}

export default function PlayerSearch({ onSelect }: PlayerSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const searchPlayers = async () => {
      if (!debouncedQuery) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Error searching players:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchPlayers();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        placeholder="Search for a player..."
        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
        autoFocus
      />
      
      {showDropdown && (query || isLoading) && (
        <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto z-50">
          {isLoading ? (
            <div className="px-4 py-2 text-gray-500">Loading...</div>
          ) : results.length === 0 ? (
            <div className="px-4 py-2 text-gray-500">No players found</div>
          ) : (
            results.map((player) => (
              <div
                key={player.player_id}
                onClick={() => {
                  onSelect(player);
                  setQuery(player.player_display_name);
                  setShowDropdown(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {player.player_display_name}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
} 