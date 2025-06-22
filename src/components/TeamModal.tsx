"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTeamsStore } from "@/stores/TeamsStore"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"

interface TeamModalProps {
  isOpen: boolean
  onClose: () => void
  team?: any
}

export default function TeamModal({ isOpen, onClose, team }: TeamModalProps) {
  const { teams, addTeam, updateTeam, removePlayerFromTeam } = useTeamsStore()
  const [formData, setFormData] = useState({
    name: "",
    playerCount: 5,
    region: "",
    country: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name,
        playerCount: team.playerCount,
        region: team.region,
        country: team.country,
      })
    } else {
      setFormData({
        name: "",
        playerCount: 5,
        region: "",
        country: "",
      })
    }
    setErrors({})
  }, [team, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Team name is required"
    } else {
      const existingTeam = teams.find(
        (t : any) => t.name.toLowerCase() === formData.name.toLowerCase() && (!team || t.id !== team.id),
      )
      if (existingTeam) {
        newErrors.name = "Team name must be unique"
      }
    }

    if (!formData.region.trim()) {
      newErrors.region = "Region is required"
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required"
    }

    if (formData.playerCount < 1 || formData.playerCount > 20) {
      newErrors.playerCount = "Player count must be between 1 and 20"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    if (team) {
      updateTeam(team.id, formData)
    } else {
      addTeam({
        ...formData,
        players: [],
      })
    }

    onClose()
  }

  const handleRemovePlayer = (playerId: number) => {
    if (team) {
      removePlayerFromTeam(team.id, playerId)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{team ? "Edit Team" : "Create New Team"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Team Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="playerCount">Player Count</Label>
            <Input
              id="playerCount"
              type="number"
              min="1"
              max="20"
              value={formData.playerCount}
              onChange={(e) => setFormData({ ...formData, playerCount: Number.parseInt(e.target.value) || 1 })}
              className={errors.playerCount ? "border-red-500" : ""}
            />
            {errors.playerCount && <p className="text-sm text-red-500">{errors.playerCount}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Input
              id="region"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              className={errors.region ? "border-red-500" : ""}
            />
            {errors.region && <p className="text-sm text-red-500">{errors.region}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className={errors.country ? "border-red-500" : ""}
            />
            {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
          </div>

          {team && team.players.length > 0 && (
            <div className="space-y-2">
              <Label>Current Players</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {team.players.map((player: any) => (
                  <div key={player.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">
                        {player.first_name} {player.last_name}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {player.position}
                      </Badge>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemovePlayer(player.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{team ? "Update Team" : "Create Team"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
