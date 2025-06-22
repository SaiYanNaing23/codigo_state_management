"use client";
import { useAuthStore } from "@/stores/AuthStore";
import  Dashboard  from "@/components/Dashboard";
import  LoginForm  from "@/components/LoginForm";

export default function Home() {
  const { isAuthenticated } = useAuthStore()
  return (
   <main className="min-h-screen bg-gray-50">{isAuthenticated ? <Dashboard /> : <LoginForm />}</main>
  );
}
