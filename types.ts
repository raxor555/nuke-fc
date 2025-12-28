
export interface Player {
  id: string;
  name: string;
  number: string;
}

export type SquadMode = '5v5' | '6v6';

export interface SelectedPlayerSlot {
  id: string; // Slot ID (e.g., 'gk', 'p1', 'p2')
  playerType: 'roster' | 'custom';
  rosterId?: string; // If from roster
  customName?: string;
  customNumber?: string;
}

export interface GoalDetail {
  type: 'roster' | 'custom';
  playerId?: string;
  customName?: string;
  minute: string;
}

export interface AppState {
  mode: SquadMode;
  venue: string;
  slots: SelectedPlayerSlot[];
  substitutes: SelectedPlayerSlot[];
  generatedImageUrl: string | null;
  isGenerating: boolean;
  error: string | null;
  logoBase64: string | null;
  referenceImageBase64: string | null;
  formation: string;
}

export interface ScorecardState {
  opponentName: string;
  nukeScore: string;
  opponentScore: string;
  nukeScorers: string;
  opponentScorers: string;
  nukeGoalDetails: GoalDetail[];
  matchType: string; // e.g., "League Match", "Friendly"
  matchPhotoBase64: string | null;
  nukeLogoBase64: string | null;
  opponentLogoBase64: string | null;
  referenceImageBase64: string | null;
  generatedImageUrl: string | null;
  isGenerating: boolean;
  error: string | null;
}

export interface MatchDayState {
  player1Image: string | null;
  player1Id: string;
  player2Image: string | null;
  player2Id: string;
  player3Image: string | null;
  player3Id: string;
  kitImageBase64: string | null;
  opponentName: string;
  venue: string;
  time: string;
  date: string;
  generatedImageUrl: string | null;
  isGenerating: boolean;
  error: string | null;
}

export type AppView = 'home' | 'squad-builder' | 'scorecard' | 'match-day';

export const ROSTER_PLAYERS: Player[] = [
  { id: '10-kamil', name: 'Kamil', number: '4' },
  { id: '11-ahmed', name: 'Ahmed', number: '11' },
  { id: '9-abdullah', name: 'Abdullah', number: '9' },
  { id: '7-rayyan', name: 'Rayyan', number: '7' },
  { id: '47-akber', name: 'Akber', number: '47' },
  { id: '5-faizan', name: 'Faizan', number: '5' },
  { id: '8-kabeer', name: 'Kabeer', number: '8' },
  { id: '18-minhaj', name: 'Minhaj', number: '18' },
  { id: '10-rehman', name: 'Rehman', number: '10' },
  { id: '19-abbad', name: 'Abbad', number: '19' },
  { id: '99-talha', name: 'Talha', number: '99' },
  { id: '22-suleyman', name: 'Suleyman', number: '22' },
  { id: '17-ammar', name: 'Ammar', number: '17' },
];

// Configuration maps formation names to role arrays (excluding Goalkeeper which is always index 0)
export const FORMATION_CONFIG: Record<string, string[]> = {
  // 5v5 Formations (GK + 4 outfield)
  '1-2-1': ['Defender', 'Midfielder', 'Midfielder', 'Attacker'],
  '2-2': ['Defender', 'Defender', 'Attacker', 'Attacker'],
  '3-1': ['Defender', 'Defender', 'Defender', 'Attacker'],

  // 6v6 Formations (GK + 5 outfield)
  '2-2-1': ['Defender', 'Defender', 'Midfielder', 'Midfielder', 'Attacker'],
  '2-1-2': ['Defender', 'Defender', 'Midfielder', 'Attacker', 'Attacker'],
  '3-2': ['Defender', 'Defender', 'Defender', 'Attacker', 'Attacker'],
};
