"use client"

import { useTeamsStore } from "@/stores/TeamsStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Users, MapPin } from "lucide-react"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface TeamsListProps {
  onEditTeam: (team: any) => void
}

export default function TeamsList({ onEditTeam }: TeamsListProps) {
  const { teams, deleteTeam } = useTeamsStore()
  const [teamToDelete, setTeamToDelete] = useState<string | null>(null)

  const handleDeleteTeam = (teamId: string) => {
    deleteTeam(teamId)
    setTeamToDelete(null)
  }

  if (teams.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No teams yet</h3>
          <p className="text-gray-600">Create your first team to get started</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team : any) => (
          <Card key={team.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{team.name}</CardTitle>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => onEditTeam(team)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTeamToDelete(team.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>
                  {team.region}, {team.country}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Players:</span>
                <Badge variant="secondary">
                  {team.players.length} / {team.playerCount}
                </Badge>
              </div>

              {team.players.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">Team Roster:</h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {team.players.map((player : any) => (
                      <div key={player.id} className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded">
                        <span>
                          {player.first_name} {player.last_name}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {player.position}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500">Created: {new Date(team.createdAt).toLocaleDateString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!teamToDelete} onOpenChange={() => setTeamToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Team</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this team? This action cannot be undone. All players will be removed from
              the team.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => teamToDelete && handleDeleteTeam(teamToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
