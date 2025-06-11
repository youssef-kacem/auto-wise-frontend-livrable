// Service d'authentification réel pour API Platform Symfony

const API_URL = "http://localhost:8000";

export interface RegisterPayload {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  plainPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: any;
}

export const authService = {
  async register(payload: RegisterPayload) {
    let response;
    try {
      response = await fetch(`${API_URL}/api/user/register`, {
        method: "POST",
        
        headers: { "Content-Type": "application/ld+json" },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      throw { message: "Impossible de contacter le serveur d'inscription." };
    }
    let data = null;
    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }
    if (!response.ok) {
      // API Platform retourne souvent une clé 'violations' pour les erreurs de validation
      if (data && data.violations) {
        throw { violations: data.violations };
      }
      throw { message: (data && (data.message || data.detail)) || "Erreur inconnue, veuillez réessayer." };
    }
    return data;
  },

  async login(payload: LoginPayload) {
    let response;
    try {
      response = await fetch(`${API_URL}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: payload.email, password: payload.password }),
      });
    } catch (e) {
      throw { message: "Impossible de contacter le serveur." };
    }
    let data = null;
    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }
    if (!response.ok || !data || !data.token) {
      // API Platform retourne souvent une clé 'message' ou 'detail' ou 'violations'
      if (data && data.violations) {
        throw { violations: data.violations };
      }
      throw { message: (data && (data.message || data.detail)) || "Erreur inconnue, veuillez réessayer." };
    }
    // Stocke le token JWT
    localStorage.setItem("autowise-token", data.token);

    // Fetch user profile to get roles
    let user = null;
    try {
      user = await authService.getUserProfile();
    } catch (e) {
      // If fetching user profile fails, clear token and throw error
      authService.clearToken();
      throw { message: "Impossible de récupérer le profil utilisateur après connexion." };
    }

    return { token: data.token, user };
  },

  saveToken(token: string) {
    localStorage.setItem("autowise-token", token);
  },
  getToken() {
    return localStorage.getItem("autowise-token");
  },
  clearToken() {
    localStorage.removeItem("autowise-token");
  },

  // Exemple d'appel authentifié
  async getUserProfile() {
    const token = authService.getToken();
    const response = await fetch(`${API_URL}/api/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Impossible de récupérer le profil utilisateur.");
    }
    return response.json();
  },

  async requestPasswordReset(email: string) {
    const response = await fetch(`${API_URL}/api/user/request-password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/ld+json',
      },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      let data = null;
      try { data = await response.json(); } catch {}
      throw new Error((data && (data.message || data.detail)) || "Erreur lors de la demande de réinitialisation.");
    }
    return response.json();
  },

  async resetPassword(token: string, password: string) {
    const response = await fetch(`${API_URL}/api/user/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/ld+json',
      },
      body: JSON.stringify({ token, password }),
    });
    if (!response.ok) {
      let data = null;
      try { data = await response.json(); } catch {}
      throw new Error((data && (data.message || data.detail)) || "Erreur lors de la réinitialisation du mot de passe.");
    }
    return response.json();
  },
}; 