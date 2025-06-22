import { create } from "zustand"
import { BalldontlieAPI } from "@balldontlie/sdk"
import { PlayersState } from "@/interfaces/index"

const api = new BalldontlieAPI({ apiKey: "4657b6ee-99fc-4636-8143-90a1d9d9bf2a" })

export const usePlayersStore = create<PlayersState>((set, get) => ({
  players: [],
  loading: false,
  hasMore: true,
  nextCursor: null,
  lastError: null,
  retryCount: 0,

  fetchPlayers: async () => {
    const { loading, hasMore, nextCursor, retryCount } = get()
    if (loading || !hasMore) return

    set({ loading: true, lastError: null })

    try {
      if (retryCount > 0) {
        await new Promise((resolve) => setTimeout(resolve, Math.min(1000 * Math.pow(2, retryCount), 10000)))
      }

      const response : any = await api.nba.getPlayers({
        cursor: nextCursor || undefined,
        per_page: 10,
      })

      set((state) => ({
        players: nextCursor === null ? response.data : [...state.players, ...response.data],
        loading: false,
        hasMore: !!response.meta.next_cursor,
        nextCursor: response.meta.next_cursor || null,
        retryCount: 0, 
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred while fetching players"

      set((state) => ({
        loading: false,
        lastError: errorMessage,
        retryCount: state.retryCount + 1,
      }))
      throw new Error(errorMessage)
    }
  },

  resetPlayers: () =>
    set({
      players: [],
      nextCursor: null,
      hasMore: true,
      lastError: null,
      retryCount: 0,
    }),

  clearError: () => set({ lastError: null }),
}))

