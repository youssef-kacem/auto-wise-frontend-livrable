
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export function useBookingNavigation() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleNextStep = (currentStep: number, setStep: (step: number) => void) => {
    setStep(currentStep + 1);
  };
  
  const handlePreviousStep = (currentStep: number, setStep: (step: number) => void) => {
    setStep(currentStep - 1);
  };
  
  const handleSubmitBooking = () => {
    // Redirect to confirmation page with booking details
    navigate("/payment/" + Math.random().toString(36).substring(2, 15));
    
    toast({
      title: "Réservation confirmée!",
      description: "Un email de confirmation vous a été envoyé.",
    });
  };

  return {
    handleNextStep,
    handlePreviousStep,
    handleSubmitBooking,
    navigate
  };
}
