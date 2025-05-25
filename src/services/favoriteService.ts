import { Car } from "@/lib/types";

// Clés pour le stockage local des favoris et de l'historique
const FAVORITES_STORAGE_KEY = "autowise_favorites";
const HISTORY_STORAGE_KEY = "autowise_viewed_cars";

// Service pour gérer les voitures favorites et l'historique
export const favoriteService = {
  // Obtenir toutes les voitures favorites
  getFavorites: (): string[] => {
    const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    try {
      const parsed = storedFavorites ? JSON.parse(storedFavorites) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  // Vérifier si une voiture est dans les favoris
  isFavorite: (carId: string): boolean => {
    const favorites = favoriteService.getFavorites();
    return favorites.includes(carId);
  },

  // Ajouter une voiture aux favoris
  addFavorite: (carId: string): void => {
    const favorites = favoriteService.getFavorites();
    if (!favorites.includes(carId)) {
      favorites.push(carId);
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    }
  },

  // Supprimer une voiture des favoris
  removeFavorite: (carId: string): void => {
    const favorites = favoriteService.getFavorites();
    const updatedFavorites = favorites.filter(id => id !== carId);
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updatedFavorites));
  },

  // Toggle favori (ajouter si absent, supprimer si présent)
  toggleFavorite: (carId: string): boolean => {
    const isFavorite = favoriteService.isFavorite(carId);
    if (isFavorite) {
      favoriteService.removeFavorite(carId);
      return false;
    } else {
      favoriteService.addFavorite(carId);
      return true;
    }
  },

  // Obtenir les voitures favorites complètes avec les détails
  getFavoriteCars: async (carService: any): Promise<Car[]> => {
    const favoriteIds = favoriteService.getFavorites();
    if (favoriteIds.length === 0) return [];
    
    // Obtenir toutes les voitures puis filtrer par ID favori
    const allCars = await carService.getAllCars();
    return allCars.filter((car: Car) => favoriteIds.includes(car.id));
  },

  // Fonctions pour l'historique des voitures consultées
  
  // Ajouter une voiture à l'historique
  addToHistory: (carId: string): void => {
    const history = favoriteService.getHistory();
    // Si la voiture est déjà dans l'historique, la supprimer pour la remettre en premier
    const filteredHistory = history.filter(id => id !== carId);
    // Ajouter l'ID en premier (le plus récent)
    filteredHistory.unshift(carId);
    // Ne garder que les 10 dernières voitures consultées
    const updatedHistory = filteredHistory.slice(0, 10);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
  },
  
  // Obtenir l'historique des voitures consultées
  getHistory: (): string[] => {
    const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
    try {
      const parsed = storedHistory ? JSON.parse(storedHistory) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },
  
  // Obtenir les voitures récemment consultées avec leurs détails
  getRecentlyViewedCars: async (carService: any): Promise<Car[]> => {
    const historyIds = favoriteService.getHistory();
    if (historyIds.length === 0) return [];
    
    // Obtenir toutes les voitures puis filtrer par ID d'historique
    const allCars = await carService.getAllCars();
    // Préserver l'ordre de l'historique
    const historyCars: Car[] = [];
    historyIds.forEach(id => {
      const car = allCars.find((c: Car) => c.id === id);
      if (car) historyCars.push(car);
    });
    return historyCars;
  },
  
  // Effacer l'historique des voitures consultées
  clearHistory: (): void => {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  }
};
