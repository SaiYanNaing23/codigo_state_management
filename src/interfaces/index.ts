export interface AuthState {
    isAuthenticated: boolean
    username: string
    email: string
    password: string
    users: User[]
    signUp: (username: string, email: string, password: string) => void
    login: (email: string, password: string) => void
    logout: () => void
}

export type User = {
  username: string;
  email: string;
  password: string;
};

export interface Player {
  id: number
  first_name: string
  last_name: string
  position: string
  height: string
  weight: string
  jersey_number: string
  college: string
  country: string
  draft_year: number
  draft_round: number
  draft_number: number
  team: {
    id: number
    conference: string
    division: string
    city: string
    name: string
    full_name: string
    abbreviation: string
  }
}

export interface PlayersState {
  players: Player[]
  loading: boolean
  hasMore: boolean
  nextCursor: number | null
  lastError: string | null
  retryCount: number
  fetchPlayers: () => Promise<void>
  resetPlayers: () => void
  clearError: () => void
}

export interface Team {
  id: string
  name: string
  playerCount: number
  region: string
  country: string
  players: Player[]
  createdAt: string
}

export interface TeamsState {
  teams: Team[]
  addTeam: (team: Omit<Team, "id" | "createdAt">) => void
  updateTeam: (id: string, team: Partial<Team>) => void
  deleteTeam: (id: string) => void
  addPlayerToTeam: (teamId: string, player: Player) => void
  removePlayerFromTeam: (teamId: string, playerId: number) => void
  isPlayerInTeam: (playerId: number) => boolean
  getTeamByPlayer: (playerId: number) => Team | undefined
}