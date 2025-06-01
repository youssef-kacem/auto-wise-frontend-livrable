import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Reservation, Car } from "@/lib/types";
import { reservationService } from "@/services/reservationService";
import { carService } from "@/services/carService";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";

export default function ReservationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!id) {
          setNotFound(true);
          return;
        }
        const res = await reservationService.getReservationById(id);
        if (!res) {
          setNotFound(true);
          return;
        }
        setReservation(res);
        const carData = await carService.getCarById(res.carId);
        setCar(carData);
      } catch (e) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Chargement...</div>;
  if (notFound || !reservation) return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold mb-2">404</h2>
      <p>Réservation introuvable ou supprimée.</p>
      <Button className="mt-4" onClick={() => navigate('/profile')}>Retour à mes réservations</Button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4">Détails de la réservation</h1>
      <div className="mb-4">
        <span className="font-medium">Référence:</span> #{reservation.id}
      </div>
      {car && (
        <div className="mb-4">
          <span className="font-medium">Véhicule:</span> {car.brand} {car.model} ({car.year})
        </div>
      )}
      <div className="mb-4">
        <span className="font-medium">Dates:</span> {format(new Date(reservation.startDate), "dd/MM/yyyy", { locale: fr })} - {format(new Date(reservation.endDate), "dd/MM/yyyy", { locale: fr })}
      </div>
      <div className="mb-4">
        <span className="font-medium">Statut:</span> {reservation.status}
      </div>
      <div className="mb-4">
        <span className="font-medium">Montant total:</span> {reservation.totalPrice} TND
      </div>
      <Button variant="outline" onClick={() => navigate(-1)}>Retour</Button>
    </div>
  );
} 