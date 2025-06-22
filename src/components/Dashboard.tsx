"use client"

import { useState } from "react"
import { useAuthStore } from "@/stores/AuthStore"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, Users, UserPlus } from "lucide-react"
import PlayersList from "./PlayerList"
import TeamsList from "./TeamLists"
import TeamModal from "./TeamModal"

export default function Dashboard() {
  const { username, logout } = useAuthStore()
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false)
  const [editingTeam, setEditingTeam] = useState(null)
  const [activeTab, setActiveTab] = useState("players")

  const handleCreateTeam = () => {
    setEditingTeam(null)
    setIsTeamModalOpen(true)
  }

  const handleEditTeam = (team: any) => {
    setEditingTeam(team)
    setIsTeamModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Basketball Team Manager</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {username}</span>
              <Button variant="outline" size="sm" onClick={logout} className="flex items-center space-x-2">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="players" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="players">Players</TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
            </TabsList>
            <Button onClick={handleCreateTeam} disabled={activeTab === "players"} className="flex items-center space-x-2">
              <UserPlus className="w-4 h-4" />
              <span>Create Team</span>
            </Button>
          </div>

          <TabsContent value="players">
            <PlayersList />
          </TabsContent>

          <TabsContent value="teams">
            <TeamsList onEditTeam={handleEditTeam} />
          </TabsContent>
        </Tabs>
      </main>

      <TeamModal isOpen={isTeamModalOpen} onClose={() => setIsTeamModalOpen(false)} team={editingTeam} />
    </div>
  )
}
