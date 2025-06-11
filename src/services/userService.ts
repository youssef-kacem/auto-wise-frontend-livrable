// Service pour gérer les utilisateurs via l'API Platform Symfony
import { authService } from './authService';

const API_URL = "http://localhost:8000";

export interface GetUsersParams {
  page?: number;
  search?: string;
}

export interface UserListResponse {
  '@context': string;
  '@id': string;
  '@type': string;
  totalItems: number;
  member: any[];
  view?: any;
}

export interface PatchUserPayload {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  image?: string; // base64
  plainPassword?: string;
}

export const userService = {
  async getUsers({ page = 1, search = "" }: GetUsersParams = {}): Promise<UserListResponse> {
    const token = authService.getToken();
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (page) params.append('page', String(page));
    const url = `${API_URL}/api/users?${params.toString()}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/ld+json',
      },
    });
    if (!response.ok) {
      throw new Error("Impossible de récupérer la liste des utilisateurs.");
    }
    return response.json();
  },
  async patchUser(id: number | string, payload: PatchUserPayload) {
    const token = authService.getToken();
    const response = await fetch(`${API_URL}/api/user/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/merge-patch+json',
        'Accept': 'application/ld+json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error("Impossible de mettre à jour l'utilisateur.");
    }
    return response.json();
  },
}; 