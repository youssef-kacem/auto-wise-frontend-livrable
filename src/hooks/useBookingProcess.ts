import { useEffect } from "react";
import { DateRange } from "react-day-picker";
import { 
  useBookingState,
  useBookingOptions, 
  useBookingDates,
  useCarData,
  useBookingNavigation
} from "@/hooks/booking";
import { useAuth } from "@/contexts/AuthContext";

export function useBookingProcess() {
  // Get all the hooks
  const { user } = useAuth();
  const { 
    carId, 
    step, 
    setStep, 
    bookingData, 
    setBookingData, 
    date, 
    setDate,
    updateBookingWithCarInfo,
    calculateDaysDifference
  } = useBookingState();
  
  const { car, loading } = useCarData(carId);
  
  const { 
    handleCheckboxChange,
    handleInsuranceChange,
    handlePaymentMethodChange,
    handlePickupLocationChange,
    handleDropoffLocationChange,
    handleSameLocationChange
  } = useBookingOptions(bookingData, setBookingData, car?.dailyPrice || 0);
  
  const { handleDateChange } = useBookingDates(
    car?.dailyPrice,
    date,
    calculateDaysDifference,
    bookingData,
    setBookingData
  );
  
  const {
    handleNextStep: baseHandleNextStep,
    handlePreviousStep: baseHandlePreviousStep,
    handleSubmitBooking,
    navigate
  } = useBookingNavigation();

  // Update booking data when car is loaded
  useEffect(() => {
    if (car) {
      updateBookingWithCarInfo(car.id, car.dailyPrice);
    }
  }, [car, updateBookingWithCarInfo]);
  
  // Load user location preferences when component mounts
  useEffect(() => {
    if (user && user.locationPreferences) {
      setBookingData(prev => ({
        ...prev,
        pickupLocation: user.locationPreferences?.pickupLocation || prev.pickupLocation,
        dropoffLocation: user.locationPreferences?.dropoffLocation || prev.dropoffLocation,
        sameReturnLocation: user.locationPreferences?.sameReturnLocation || prev.sameReturnLocation
      }));
    }
  }, [user, setBookingData]);
  
  // Format price (e.g., "250 TND")
  const formatPrice = (price: number) => {
    return `${price} TND`;
  };
  
  // Wrapper functions to pass the current step
  const handleNextStep = () => baseHandleNextStep(step, setStep);
  const handlePreviousStep = () => baseHandlePreviousStep(step, setStep);
  
  // Handle date change and update state
  const handleDateChangeAndUpdate = (range: DateRange | undefined) => {
    const newRange = handleDateChange(range);
    if (newRange) setDate(newRange);
  };

  return {
    carId,
    car,
    loading,
    step,
    bookingData,
    date,
    handleDateChange: handleDateChangeAndUpdate,
    handleCheckboxChange,
    handleInsuranceChange,
    handlePaymentMethodChange,
    handlePickupLocationChange,
    handleDropoffLocationChange,
    handleSameLocationChange,
    formatPrice,
    handleNextStep,
    handlePreviousStep,
    handleSubmitBooking,
    navigate
  };
}
