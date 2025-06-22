"use client"

import { useState } from "react"
import { useTeamsStore } from "@/stores/TeamsStore"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Users } from "lucide-react"

interface PlayerSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  player: any
}

export default function PlayerSelectionModal({ isOpen, onClose, player }: PlayerSelectionModalProps) {
  const { teams, addPlayerToTeam } = useTeamsStore()
  const [selectedTeamId, setSelectedTeamId] = useState("")

  const availableTeams = teams.filter((team : any) => team.players.length < team.playerCount)

  const handleAddToTeam = () => {
    if (selectedTeamId && player) {
      addPlayerToTeam(selectedTeamId, player)
      onClose()
      setSelectedTeamId("")
    }
  }

  if (!player) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Player to Team</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold">
              {player.first_name} {player.last_name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline">{player.position}</Badge>
              <span className="text-sm text-gray-600">{player.team.full_name}</span>
            </div>
          </div>

          {availableTeams.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No teams available</p>
              <p className="text-sm text-gray-500">All teams are at full capacity or no teams exist</p>
            </div>
          ) : (
            <div className="space-y-3">
              <Label>Select a team:</Label>
              <RadioGroup value={selectedTeamId} onValueChange={setSelectedTeamId}>
                {availableTeams.map((team : any) => (
                  <div key={team.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={team.id} id={team.id} />
                    <Label htmlFor={team.id} className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{team.name}</span>
                          <p className="text-sm text-gray-600">
                            {team.region}, {team.country}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {team.players.length}/{team.playerCount}
                        </Badge>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleAddToTeam} disabled={!selectedTeamId || availableTeams.length === 0}>
              Add to Team
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
