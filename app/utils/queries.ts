// Team name to abbreviation mapping
export const TEAM_ABBREVIATIONS: { [key: string]: string } = {
  'Arizona Cardinals': 'ARI',
  'Atlanta Falcons': 'ATL',
  'Baltimore Ravens': 'BAL',
  'Buffalo Bills': 'BUF',
  'Carolina Panthers': 'CAR',
  'Chicago Bears': 'CHI',
  'Cincinnati Bengals': 'CIN',
  'Cleveland Browns': 'CLE',
  'Dallas Cowboys': 'DAL',
  'Denver Broncos': 'DEN',
  'Detroit Lions': 'DET',
  'Green Bay Packers': 'GB',
  'Houston Texans': 'HOU',
  'Indianapolis Colts': 'IND',
  'Jacksonville Jaguars': 'JAX',
  'Kansas City Chiefs': 'KC',
  'Oakland Raiders': 'OAK',
  'Las Vegas Raiders': 'LV',
  'San Diego Chargers': 'SD',
  'Los Angeles Chargers': 'LAC',
  'St. Louis Rams': 'STL',
  'Los Angeles Rams': 'LA',
  'Miami Dolphins': 'MIA',
  'Minnesota Vikings': 'MIN',
  'New England Patriots': 'NE',
  'New Orleans Saints': 'NO',
  'New York Giants': 'NYG',
  'New York Jets': 'NYJ',
  'Philadelphia Eagles': 'PHI',
  'Pittsburgh Steelers': 'PIT',
  'San Francisco 49ers': 'SF',
  'Seattle Seahawks': 'SEA',
  'Tampa Bay Buccaneers': 'TB',
  'Tennessee Titans': 'TEN',
  'Washington Commanders': 'WAS'
};

// Query to validate if a player played for both teams
export const validatePlayerTeamsQuery = `
  WITH player_teams AS (
    SELECT DISTINCT player_id, player_name, recent_team
    FROM (
      SELECT player_id, player_name, recent_team
      FROM player_stats_season_1999
      UNION ALL
      SELECT player_id, player_name, recent_team FROM player_stats_season_2000
      UNION ALL
      SELECT player_id, player_name, recent_team FROM player_stats_season_2001
      UNION ALL
      SELECT player_id, player_name, recent_team FROM player_stats_season_2002
      UNION ALL
      SELECT player_id, player_name, recent_team FROM player_stats_season_2003
      UNION ALL
      SELECT player_id, player_name, recent_team FROM player_stats_season_2004
      UNION ALL
      SELECT player_id, player_name, recent_team FROM player_stats_season_2005
      UNION ALL
      SELECT player_id, player_name, recent_team FROM player_stats_season_2006
      UNION ALL
      SELECT player_id, player_name, recent_team FROM player_stats_season_2007
      UNION ALL
      SELECT player_id, player_name, recent_team FROM player_stats_season_2008
      UNION ALL
      SELECT player_id, player_name, recent_team FROM player_stats_season_2009
      UNION ALL
      SELECT player_id, player_name, recent_team FROM player_stats_season_2010
      UNION ALL
      SELECT player_id, player_name, recent_team FROM player_stats_season_2011
      UNION ALL
      SELECT player_id, player_name, recent_team FROM player_stats_season_2012
      UNION ALL
      SELECT player_id, player_name, recent_team FROM player_stats_season_2013
      UNION ALL
      SELECT player_id, player_name, recent_team FROM player_stats_season_2014
      UNION ALL
      SELECT player_id, player_name, recent_team FROM player_stats_season_2015
      UNION ALL
      SELECT player_id, player_name, recent_team FROM player_stats_season_2016
      UNION ALL
      SELECT player_id, player_name, recent_team FROM player_stats_season_2017
      UNION ALL
      SELECT player_id, player_name, recent_team FROM player_stats_season_2018
      UNION ALL
      SELECT player_id, player_name, recent_team FROM player_stats_season_2019
      UNION ALL
      SELECT player_id, player_name, recent_team FROM player_stats_season_2020
      UNION ALL
      SELECT player_id, player_name, recent_team FROM player_stats_season_2021
      UNION ALL
      SELECT player_id, player_name, recent_team FROM player_stats_season_2022
      UNION ALL
      SELECT player_id, player_name, recent_team FROM player_stats_season_2023
      UNION ALL
      SELECT player_id, player_name, recent_team FROM player_stats_season_2024
    )
    WHERE player_id = ? AND (recent_team = ? OR recent_team = ?)
  )
  SELECT player_id, player_name
  FROM player_teams
  GROUP BY player_id, player_name
  HAVING COUNT(DISTINCT recent_team) = 2;
`; 