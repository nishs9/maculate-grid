'use client';

import { useState, useEffect } from 'react';
import Grid from './components/Grid';

// List of all NFL teams
const ALL_NFL_TEAMS = [
  'Arizona Cardinals', 'Atlanta Falcons', 'Baltimore Ravens', 'Buffalo Bills',
  'Carolina Panthers', 'Chicago Bears', 'Cincinnati Bengals', 'Cleveland Browns',
  'Dallas Cowboys', 'Denver Broncos', 'Detroit Lions', 'Green Bay Packers',
  'Houston Texans', 'Indianapolis Colts', 'Jacksonville Jaguars', 'Kansas City Chiefs',
  'Las Vegas Raiders', 'Los Angeles Chargers', 'Los Angeles Rams', 'Miami Dolphins',
  'Minnesota Vikings', 'New England Patriots', 'New Orleans Saints', 'New York Giants',
  'New York Jets', 'Philadelphia Eagles', 'Pittsburgh Steelers', 'San Francisco 49ers',
  'Seattle Seahawks', 'Tampa Bay Buccaneers', 'Tennessee Titans', 'Washington Commanders'
];

export default function Home() {
  const [rowTeams, setRowTeams] = useState<string[]>([]);
  const [colTeams, setColTeams] = useState<string[]>([]);

  useEffect(() => {
    // Function to randomly select 3 unique teams
    const getRandomTeams = () => {
      const shuffled = [...ALL_NFL_TEAMS].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 3);
    };

    setRowTeams(getRandomTeams());
    setColTeams(getRandomTeams());
  }, []);

  return (
    <main className="min-h-screen p-8 flex flex-col">
      <div className="max-w-4xl mx-auto flex-grow">
        <h1 className="text-3xl font-bold mb-8">Maculate Grid</h1>
        <Grid rowTeams={rowTeams} colTeams={colTeams} />
      </div>
      <footer className="mt-8 pb-4 text-center text-sm text-gray-500">
        <a 
          href="https://github.com/nishs9/maculate-grid" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-gray-700 underline"
        >
          Source Code (Github)
        </a>
      </footer>
    </main>
  );
} 