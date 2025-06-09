import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { users } from '@/lib/mockData';
import { toast } from '@/hooks/use-toast';
import { authService, RegisterPayload, LoginPayload } from "@/services/authService";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterPayload) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('autowise-user');
    const token = authService.getToken();
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('autowise-user');
        authService.clearToken();
      }
    }
    setIsLoading(false);
  }, []);

  // Nouvelle fonction login réelle
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Appel à /auth pour obtenir le token
      const token = await authService.login({ email, password });
      // Appel à /api/user/me pour obtenir le profil utilisateur
      const userProfile = await authService.getUserProfile();
      setUser(userProfile);
      localStorage.setItem('autowise-user', JSON.stringify(userProfile));
      setIsLoading(false);
      return true;
    } catch (error: any) {
      toast({
        title: "Échec de connexion",
        description: error.message || "Erreur lors de la connexion.",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  // Nouvelle fonction register réelle
  const register = async (userData: RegisterPayload) => {
    setIsLoading(true);
    try {
      const data = await authService.register(userData);
      if (!data) {
        toast({
          title: "Erreur d'inscription",
          description: "Réponse inattendue du serveur.",
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }
      toast({
        title: "Inscription réussie !",
        description: "Vérifiez votre email pour activer votre compte.",
      });
      setIsLoading(false);
      return true;
    } catch (error: any) {
      toast({
        title: "Échec de l'inscription",
        description: error.message || "Erreur lors de l'inscription.",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('autowise-user');
    authService.clearToken();
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !",
    });
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return false;
    
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('autowise-user', JSON.stringify(updatedUser));
    
    // Update in the users array (simulating DB update)
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
    }
    
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été mises à jour avec succès",
    });
    
    setIsLoading(false);
    return true;
  };

  const updatePassword = async (oldPassword: string, newPassword: string) => {
    // Simulate password change
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Mot de passe mis à jour",
      description: "Votre mot de passe a été modifié avec succès",
    });
    
    setIsLoading(false);
    return true;
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      updateUser,
      updatePassword,
      isAuthenticated,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
