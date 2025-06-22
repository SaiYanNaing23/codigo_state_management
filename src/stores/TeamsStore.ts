import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Team } from "@/interfaces/index"
import { TeamsState } from "@/interfaces/index"


export const useTeamsStore = create<TeamsState>()(
  persist(
    (set, get) => ({
      teams: [],

      addTeam: (teamData) => {
        const newTeam: Team = {
          ...teamData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ teams: [...state.teams, newTeam] }))
      },

      updateTeam: (id, updatedData) => {
        set((state) => ({
          teams: state.teams.map((team) => (team.id === id ? { ...team, ...updatedData } : team)),
        }))
      },

      deleteTeam: (id) => {
        set((state) => ({
          teams: state.teams.filter((team) => team.id !== id),
        }))
      },

      addPlayerToTeam: (teamId, player) => {
        set((state) => ({
          teams: state.teams.map((team) =>
            team.id === teamId ? { ...team, players: [...team.players, player] } : team,
          ),
        }))
      },

      removePlayerFromTeam: (teamId, playerId) => {
        set((state) => ({
          teams: state.teams.map((team) =>
            team.id === teamId ? { ...team, players: team.players.filter((p) => p.id !== playerId) } : team,
          ),
        }))
      },

      isPlayerInTeam: (playerId) => {
        const { teams } = get()
        return teams.some((team) => team.players.some((player) => player.id === playerId))
      },

      getTeamByPlayer: (playerId) => {
        const { teams } = get()
        return teams.find((team) => team.players.some((player) => player.id === playerId))
      },
    }),
    {
      name: "teams-storage",
    },
  ),
)
