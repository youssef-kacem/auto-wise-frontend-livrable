import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";

export interface BookingData {
  carId: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalPrice: number;
  pickupLocation: string;
  dropoffLocation: string;
  sameReturnLocation: boolean;
  driverIncluded: boolean;
  carInsurance: string;
  childSeat: boolean;
  gps: boolean;
  additionalDriver: boolean;
  wifiHotspot: boolean;
  paymentMethod: string;
}

export function useBookingState() {
  const [searchParams] = useSearchParams();
  const carId = searchParams.get("carId");
  
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    carId: "",
    startDate: "",
    endDate: "",
    totalDays: 1,
    totalPrice: 0,
    pickupLocation: "",
    dropoffLocation: "",
    sameReturnLocation: true,
    driverIncluded: false,
    carInsurance: "standard",
    childSeat: false,
    gps: false,
    additionalDriver: false,
    wifiHotspot: false,
    paymentMethod: "creditCard",
  });
  
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 3)
  });
  
  // Update booking data with car info
  const updateBookingWithCarInfo = (carId: string, dailyPrice: number) => {
    if (date?.from && date?.to) {
      const startDate = format(date.from, 'yyyy-MM-dd');
      const endDate = format(date.to, 'yyyy-MM-dd');
      const days = calculateDaysDifference(date.from, date.to);

      setBookingData(prev => ({
        ...prev,
        carId,
        startDate,
        endDate,
        totalDays: days,
        totalPrice: calculateTotalPrice(
          dailyPrice,
          days,
          prev.driverIncluded,
          prev.carInsurance,
          prev.childSeat,
          prev.gps,
          prev.additionalDriver,
          prev.wifiHotspot
        )
      }));
    } else {
      setBookingData(prev => ({
        ...prev,
        carId,
        totalPrice: calculateTotalPrice(
          dailyPrice,
          1,
          prev.driverIncluded,
          prev.carInsurance,
          prev.childSeat,
          prev.gps,
          prev.additionalDriver,
          prev.wifiHotspot
        )
      }));
    }
  };
  
  // Calculate days between two dates
  const calculateDaysDifference = (start: Date, end: Date) => {
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };
  
  return {
    carId,
    step,
    setStep,
    bookingData,
    setBookingData,
    date,
    setDate,
    updateBookingWithCarInfo,
    calculateDaysDifference
  };
}

// Calculate total price in TND
export const calculateTotalPrice = (
  basePrice: number,
  days: number,
  driverIncluded: boolean,
  insurance: string,
  childSeat: boolean,
  gps: boolean,
  additionalDriver: boolean,
  wifiHotspot: boolean = false
) => {
  let total = basePrice * days;
  
  // Additional options (prices in TND)
  if (driverIncluded) total += 80 * days; // 80 TND per day for driver
  if (insurance === "full") total += 12 * days; // 12 TND per day for full insurance
  if (insurance === "premium") total += 25 * days; // 25 TND per day for premium insurance
  if (childSeat) total += 8 * days; // 8 TND per day for child seat
  if (gps) total += 5 * days; // 5 TND per day for GPS
  if (additionalDriver) total += 30 * days; // 30 TND per day for additional driver
  if (wifiHotspot) total += 6 * days; // 6 TND per day for WiFi hotspot
  
  return Math.round(total);
};
