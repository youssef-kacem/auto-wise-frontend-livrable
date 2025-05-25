// Types for our data models
export interface User {
  id: string;
  role: "client" | "admin";
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  postalCode?: string;
  address?: string;
  cinPassport?: string;
  profilePicture?: string;
  avatar?: string; // Added for backward compatibility
  notificationPreferences?: NotificationPreferences;
  locationPreferences?: LocationPreferences;
  createdAt: string;
  isActive?: boolean; // Ajouté pour la gestion du blocage/déblocage
}

export interface NotificationPreferences {
  email: boolean;
  browser: boolean;
  sms: boolean;
}

export interface LocationPreferences {
  pickupLocation: string;
  dropoffLocation: string;
  sameReturnLocation: boolean;
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  transmission: "manuel" | "automatique";
  fuelType: "essence" | "diesel" | "électrique" | "hybride";
  seats: number;
  dailyPrice: number;
  hasAC: boolean;
  hasGPS: boolean;
  childSeatAvailable: boolean;
  driverAvailable: boolean;
  description: string;
  images: string[];
  availability: {
    available: boolean;
    availableDates?: DateRange[];
  };
  features: string[];
  category: "économique" | "standard" | "premium" | "luxe" | "utilitaire";
  location?: string;
  rating?: number;
  reviews?: Review[];
}

// Interface pour les avis/reviews (si nécessaire)
export interface Review {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  date: string;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

// Types de statut de réservation - support pour les deux langues
export type ReservationStatus = "pending" | "confirmed" | "cancelled" | "completed" | "en attente" | "confirmée" | "annulée" | "terminée";
export type PaymentStatus = "pending" | "paid" | "refunded";

// Fonctions d'aide pour la conversion des statuts
export const statusEnToFr = (status: ReservationStatus): ReservationStatus => {
  const mapping: Record<string, ReservationStatus> = {
    "pending": "en attente",
    "confirmed": "confirmée",
    "cancelled": "annulée",
    "completed": "terminée"
  };
  return (mapping[status] || status) as ReservationStatus;
};

export const statusFrToEn = (status: ReservationStatus): ReservationStatus => {
  const mapping: Record<string, ReservationStatus> = {
    "en attente": "pending",
    "confirmée": "confirmed",
    "annulée": "cancelled",
    "terminée": "completed"
  };
  return (mapping[status] || status) as ReservationStatus;
};

// Mise à jour de l'interface Reservation pour utiliser les nouveaux types
export interface Reservation {
  id: string;
  userId: string;
  carId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: ReservationStatus;
  withDriver: boolean;
  withChildSeat: boolean;
  withGPS: boolean;
  paymentMethod?: string;
  createdAt: string;
  paymentStatus?: PaymentStatus;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  isRead?: boolean; // Added for compatibility with existing code
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  content: string;
  read: boolean;
  type: "réservation" | "paiement" | "système" | "promotion";
  timestamp: string;
}

// Interface pour les conversations dans Messages
export interface Conversation {
  id: string;
  userId: string;
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
  otherParticipant?: {
    id: string;
    name: string;
    avatar: any;
  };
  user?: {
    id: string;
    name: string;
    avatar: any;
  };
}

// Type pour les props du composant Chat
export interface ChatProps {
  receiverId: string;
  receiverName: string;
}
