import { create } from "zustand"
import { persist } from "zustand/middleware"
import { AuthState, User } from "@/interfaces/index"
import { toast } from "sonner"

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      username: "",
      email: "",
      password: "",
      users: [],

      signUp: (username, email, password) => {
        try {
          const stored = localStorage.getItem("auth-storage");
          let existingUsers: User[] = [];

          if (stored) {
            const { state } = JSON.parse(stored);
            existingUsers = state.users || [];
          }

          const emailExists = existingUsers.some((user) => user.email === email);

          if (emailExists) {
            toast.error("Email already exists. Please log in.");
            return ;
          }

          const newUser = { username, email, password };
          const updatedUsers = [...existingUsers, newUser];

          set({
            isAuthenticated: true,
            username,
            email,
            password,
            users: updatedUsers,
          });

          toast.success("Sign up successful!");
        } catch (error) {
          console.error("Sign up failed:", error);
          toast.error("Sign up failed. Please try again.");
        }
      },

      login: (email, password) => {
        try {
          const stored = localStorage.getItem("auth-storage");

          if (!stored) {
            toast.error("No users found. Please sign up first.");
            return;
          }

          const { state } = JSON.parse(stored);
          const users: User[] = state.users || [];

          const user = users.find(
            (u) => u.email === email && u.password === password
          );

          if (user) {
            set({
              isAuthenticated: true,
              username: user.username,
              email: user.email,
              password: user.password,
            });

            toast.success(`Welcome back, ${user.username}!`);
          } else {
            toast.error("Invalid email or password.");
          }
        } catch (error) {
          console.error("Login failed:", error);
          toast.error("Login failed. Please try again.");
        }
      },

      logout: () =>
        set({
          isAuthenticated: false,
          username: "",
          email: "",
          password: "",
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);
