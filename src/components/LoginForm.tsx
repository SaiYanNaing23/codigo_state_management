"use client"

import type React from "react"

import { useState } from "react"
import { useAuthStore } from "@/stores/AuthStore";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { User } from "lucide-react"

export default function LoginForm() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSignIn, setIsSignIn] = useState(false);
  const { signUp, login } = useAuthStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if(!isSignIn){
        if (!username || !email || !password) {
          setError("All fields are required")
          return
        }
       
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          setError("Please enter a valid email address")
          return
        }
        
        if (password.length < 6) {
          setError("Password must be at least 6 characters long")
          return
        }
        signUp(username.trim(), email.trim(), password.trim())
    }else{
        if (!email || !password) {
          setError("Email and password are required")
          return
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          setError("Please enter a valid email address")
          return
        }
        
        if (password.length < 6) {
          setError("Password must be at least 6 characters long")
          return
        }
        login(email.trim(), password.trim())
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <CardDescription>Basketball Team Manager</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isSignIn && 
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e : any) => {
                  setUsername(e.target.value)
                  setError("")
                }}
                className={error ? "border-red-500" : ""}
              />
            </div>
            }
            <div className="space-y-2">
              <Label htmlFor="email">Emain</Label>
              <Input
                id="email"
                type="text"
                placeholder="Enter your email"
                value={email}
                onChange={(e : any) => {
                  setEmail(e.target.value)
                  setError("")
                }}
                className={error ? "border-red-500" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="text"
                placeholder="Enter your password"
                value={password}
                onChange={(e : any) => {
                  setPassword(e.target.value)
                  setError("")
                }}
                className={error ? "border-red-500" : ""}
              />
              <Label className="px-0 cursor-pointer hover:underline mt-3" 
                onClick={() => {
                    setIsSignIn(!isSignIn) 
                    setError("")
                }} > 
                {!isSignIn ? "Already has an account? signIn" : "Doesn't have an account? SignUp"}</Label>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            <Button type="submit" className="w-full">
              Sign {isSignIn ? "In" : "Up"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
