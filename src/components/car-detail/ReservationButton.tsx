import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ReservationButtonProps {
  carId: string;
}

export function ReservationButton({ carId }: ReservationButtonProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    if (!isAuthenticated) {
      // On stocke la page courante pour rediriger après login
      navigate("/login", { state: { from: location.pathname + location.search } });
    } else {
      navigate(`/booking?carId=${carId}`);
    }
  };

  return (
    <Button className="w-full bg-autowise-blue hover:bg-autowise-navy mt-4" onClick={handleClick}>
      <Calendar className="mr-2 h-4 w-4" />
      Réserver maintenant
    </Button>
  );
}
