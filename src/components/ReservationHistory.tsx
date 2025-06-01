import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { reservationService } from "@/services/reservationService";
import { carService } from "@/services/carService";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Car as CarIcon, Calendar, CreditCard, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ReservationWithCar } from "@/types/reservation";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

export function ReservationHistory() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<ReservationWithCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [existingReservationIds, setExistingReservationIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const userReservations = await reservationService.getUserReservations(user.id);
        
        // Enrichir les réservations avec les détails de la voiture
        const enrichedReservations = await Promise.all(
          userReservations.map(async (reservation) => {
            const car = await carService.getCarById(reservation.carId);
            return { ...reservation, car };
          })
        );
        
        // Conversion explicite pour éviter les erreurs de type
        setReservations(enrichedReservations as unknown as ReservationWithCar[]);
      } catch (error) {
        console.error("Erreur lors de la récupération des réservations:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger votre historique de réservations",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [user]);

  useEffect(() => {
    reservationService.getAllReservations().then(resList => {
      setExistingReservationIds(resList.map(r => r.id));
    });
  }, []);

  // Fonction pour obtenir la couleur du badge de statut
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "confirmée":
      case "confirmed":
        return "bg-green-500 hover:bg-green-600";
      case "en attente":
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "annulée":
      case "cancelled":
        return "bg-red-500 hover:bg-red-600";
      case "terminée":
      case "completed":
        return "bg-gray-500 hover:bg-gray-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };
  
  // Fonction pour obtenir la couleur du badge de paiement
  const getPaymentBadgeColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500 hover:bg-green-600";
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "refunded":
        return "bg-blue-500 hover:bg-blue-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  // Fonction pour traduire le statut de paiement
  const translatePaymentStatus = (status: string) => {
    switch (status) {
      case "paid":
        return "Payé";
      case "pending":
        return "En attente";
      case "refunded":
        return "Remboursé";
      default:
        return status;
    }
  };

  // Filtrer les réservations pour n'afficher que celles qui existent vraiment dans les mocks
  const filteredReservations = reservations.filter(r => existingReservationIds.includes(r.id));

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Mes réservations</h2>
        </div>
        
        {[1, 2].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <Skeleton className="h-32 w-48 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-2 mt-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                  <div className="space-y-2 min-w-[120px] text-right">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-3/4 ml-auto" />
                    <Skeleton className="h-10 w-full mt-4" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredReservations && filteredReservations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mes réservations</CardTitle>
          <CardDescription>Vous n'avez pas encore de réservation</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-8">
          <Calendar className="h-16 w-16 text-gray-300 mb-4" />
          <p className="text-center text-gray-500 mb-6">
            Vous n'avez pas encore effectué de réservation.
            <br />
            Explorez notre sélection de véhicules et effectuez votre première réservation !
          </p>
          <Button asChild>
            <Link to="/cars">Voir nos véhicules</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mes réservations</h2>
      </div>
      
      {filteredReservations.map((reservation) => (
        <Card key={reservation.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Image de la voiture */}
                <div className="md:w-48 h-32 overflow-hidden rounded-md">
                  <img 
                    src={reservation.car?.images?.[0] || "/placeholder.svg"}
                    alt={reservation.car?.brand + " " + reservation.car?.model}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Détails de la réservation */}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">
                    {reservation.car?.brand} {reservation.car?.model}
                  </h3>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {format(new Date(reservation.startDate), "dd MMM yyyy", {locale: fr})} - {format(new Date(reservation.endDate), "dd MMM yyyy", {locale: fr})}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getStatusBadgeColor(reservation.status)}>
                      {reservation.status}
                    </Badge>
                    <Badge className={getPaymentBadgeColor(reservation.paymentStatus)}>
                      {translatePaymentStatus(reservation.paymentStatus)}
                    </Badge>
                    {reservation.withDriver && (
                      <Badge variant="outline">Avec chauffeur</Badge>
                    )}
                    {reservation.withChildSeat && (
                      <Badge variant="outline">Siège enfant</Badge>
                    )}
                    {reservation.withGPS && (
                      <Badge variant="outline">GPS</Badge>
                    )}
                  </div>
                </div>
                
                {/* Prix et boutons d'action */}
                <div className="text-right">
                  <div className="font-bold text-lg">
                    {reservation.totalPrice} TND
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    Réservé le {format(new Date(reservation.createdAt), "dd/MM/yyyy")}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full"
                      asChild
                    >
                      <Link to={`/cars/${reservation.carId}`}>
                        <CarIcon className="h-4 w-4 mr-2" />
                        Voir le véhicule
                      </Link>
                    </Button>
                    
                    {(reservation.paymentStatus === "pending") && (
                      <Button 
                        size="sm"
                        className="w-full"
                        asChild
                      >
                        <Link to={`/payment/${reservation.id}`}>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Payer
                        </Link>
                      </Button>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full"
                      asChild
                      disabled={!reservation.id || !existingReservationIds.includes(reservation.id)}
                    >
                      <Link to={`/reservations/${reservation.id}`}>
                        <Info className="h-4 w-4 mr-2" />
                        Détails
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
