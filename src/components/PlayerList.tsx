"use client"

import { useEffect, useCallback, useRef } from "react"
import { usePlayersStore } from "@/stores/PlayerStore"
import { useTeamsStore } from "@/stores/TeamsStore"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, UserPlus, UserCheck, AlertCircle, RefreshCw } from "lucide-react"
import PlayerSelectionModal from "./PlayerSelectionModal"
import { useState } from "react"
import { toast } from "sonner"

export default function PlayersList() {
  const { players, loading, hasMore, fetchPlayers, lastError, retryCount } = usePlayersStore()
  const { isPlayerInTeam, getTeamByPlayer } = useTeamsStore()
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const observerRef = useRef<IntersectionObserver>()
  const [isRetrying, setIsRetrying] = useState(false)

  const lastPlayerElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return
      if (observerRef.current) observerRef.current.disconnect()

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !lastError) {
          handleFetchPlayers()
        }
      })

      if (node) observerRef.current.observe(node)
    },
    [loading, hasMore, lastError],
  )

  const handleFetchPlayers = async () => {
    try {
      await fetchPlayers()
    } catch (error) {
      // Show toast error instead of breaking the UI
      const errorMessage = error instanceof Error ? error.message : "Failed to load more players"

      if (
        errorMessage.toLowerCase().includes("too many requests") ||
        errorMessage.toLowerCase().includes("rate limit")
      ) {
        toast(`Too many requests. Please wait a moment before loading more players. (Retry ${retryCount}/5)`)
      } else {
        toast(`${ errorMessage}`)
      }
    }
  }

  const handleRetry = async () => {
    setIsRetrying(true)
    try {
      await fetchPlayers()
      toast("Players loaded successfully!")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load players"
      toast( errorMessage)
    } finally {
      setIsRetrying(false)
    }
  }

  useEffect(() => {
    if (players.length === 0) {
      handleFetchPlayers()
    }
  }, [])

  const handleAddToTeam = (player: any) => {
    setSelectedPlayer(player)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map((player, index) => {
          const playerInTeam = isPlayerInTeam(player.id)
          const team = getTeamByPlayer(player.id)

          return (
            <Card
              key={player.id}
              ref={index === players.length - 1 ? lastPlayerElementRef : null}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {player.first_name} {player.last_name}
                    </h3>
                    <p className="text-sm text-gray-600">{player.position}</p>
                  </div>
                  <Badge variant={playerInTeam ? "secondary" : "outline"}>
                    {playerInTeam ? "In Team" : "Available"}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Height:</span>
                    <span>{player.height || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weight:</span>
                    <span>{player.weight ? `${player.weight} lbs` : "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Jersey:</span>
                    <span>#{player.jersey_number || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>NBA Team:</span>
                    <span>{player.team.full_name}</span>
                  </div>
                  {player.college && (
                    <div className="flex justify-between">
                      <span>College:</span>
                      <span>{player.college}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Country:</span>
                    <span>{player.country}</span>
                  </div>
                  {player.draft_year && (
                    <div className="flex justify-between">
                      <span>Draft:</span>
                      <span>
                        {player.draft_year} R{player.draft_round} #{player.draft_number}
                      </span>
                    </div>
                  )}
                </div>

                {playerInTeam && team && (
                  <div className="mt-3 p-2 bg-blue-50 rounded-md">
                    <p className="text-xs text-blue-700">
                      Currently in: <strong>{team.name}</strong>
                    </p>
                  </div>
                )}

                <div className="mt-4">
                  <Button
                    onClick={() => handleAddToTeam(player)}
                    disabled={playerInTeam}
                    size="sm"
                    className="w-full"
                    variant={playerInTeam ? "secondary" : "default"}
                  >
                    {playerInTeam ? (
                      <>
                        <UserCheck className="w-4 h-4 mr-2" />
                        In Team
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add to Team
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading more players...</span>
          </div>
        </div>
      )}

      {/* Error state with retry option */}
      {lastError && !loading && (
        <div className="flex flex-col items-center py-8 space-y-4">
          <div className="flex items-center space-x-2 text-amber-600">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">Unable to load more players</span>
          </div>
          <Button
            onClick={handleRetry}
            disabled={isRetrying}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            {isRetrying ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            <span>{isRetrying ? "Retrying..." : "Try Again"}</span>
          </Button>
        </div>
      )}

      {/* End of list indicator */}
      {!hasMore && players.length > 0 && !lastError && (
        <div className="text-center py-8 text-gray-500">
          <p>No more players to load</p>
        </div>
      )}

      {/* Empty state */}
      {players.length === 0 && !loading && !lastError && (
        <div className="text-center py-12">
          <p className="text-gray-500">No players found</p>
          <Button onClick={handleFetchPlayers} className="mt-4">
            Load Players
          </Button>
        </div>
      )}

      <PlayerSelectionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} player={selectedPlayer} />
    </div>
  )
}
