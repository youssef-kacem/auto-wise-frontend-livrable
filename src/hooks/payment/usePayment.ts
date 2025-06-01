import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { reservationService } from "@/services/reservationService";
import { carService } from "@/services/carService";
import { Car, Reservation } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { isValid } from "date-fns";

/**
 * Hook de gestion du paiement d'une réservation
 * - Récupère la réservation et la voiture associée
 * - Expose l'état réel de paiement (pas de simulation)
 * - Prêt pour intégration d'un vrai backend
 */
export function usePayment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  // Statut de paiement réel (issu de la réservation)
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "paid" | "refunded">("pending");

  useEffect(() => {
    const fetchReservation = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Récupérer la réservation réelle
        const reservationData = await reservationService.getReservationById(id);
        if (!reservationData) {
          toast({
            title: "Erreur",
            description: "Réservation introuvable",
            variant: "destructive",
          });
          navigate("/profile");
          return;
        }
        // Nettoyage des dates
        const sanitizedReservation = {
          ...reservationData,
          startDate: validateDateString(reservationData.startDate),
          endDate: validateDateString(reservationData.endDate),
        };
        setReservation(sanitizedReservation as Reservation);
        setPaymentStatus(sanitizedReservation.paymentStatus || "pending");
        // Récupérer la voiture associée
        const carData = await carService.getCarById(reservationData.carId);
        setCar(carData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails de la réservation",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchReservation();
  }, [id, navigate]);

  // Validation de date utilitaire
  const validateDateString = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return isValid(date) ? dateString : new Date().toISOString();
    } catch (error) {
      return new Date().toISOString();
    }
  };

  return {
    reservation,
    car,
    loading,
    paymentStatus,
    setPaymentStatus,
    id,
    navigate
  };
}
