import { NextRequest, NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { validatePlayerTeamsQuery, TEAM_ABBREVIATIONS } from '../../utils/queries';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    const { playerId, rowTeam, colTeam } = await request.json();

    // Convert full team names to abbreviations
    const rowTeamAbbr = TEAM_ABBREVIATIONS[rowTeam];
    const colTeamAbbr = TEAM_ABBREVIATIONS[colTeam];

    if (!rowTeamAbbr || !colTeamAbbr) {
      return NextResponse.json(
        { error: 'Invalid team name' },
        { status: 400 }
      );
    }

    // Open database connection
    const db = await open({
      filename: 'nfl_stats.db',
      driver: sqlite3.Database
    });

    const result = await db.get(validatePlayerTeamsQuery, [
      playerId,
      rowTeamAbbr,
      colTeamAbbr
    ]);

    console.log(result);

    // Calculate rarity (for now, just return a placeholder value)
    const rarity = result ? 50 : 0;

    return NextResponse.json({
      isCorrect: !!result,
      rarity
    });
  } catch (error) {
    console.error('Error validating answer:', error);
    return NextResponse.json(
      { error: 'Failed to validate answer' },
      { status: 500 }
    );
  }
} 