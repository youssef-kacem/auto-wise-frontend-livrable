import { Users, Fuel, Calendar, CarIcon, MapPin, Clock } from "lucide-react";
import { Car } from "@/lib/types";

interface CarSpecificationsProps {
  car: Car;
}

export function CarSpecifications({ car }: CarSpecificationsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      <div className="flex items-center">
        <Users className="h-5 w-5 mr-2 text-autowise-blue" />
        <span>{car.seats} places</span>
      </div>
      <div className="flex items-center">
        <Fuel className="h-5 w-5 mr-2 text-autowise-blue" />
        <span>{car.fuelType}</span>
      </div>
      <div className="flex items-center">
        <Calendar className="h-5 w-5 mr-2 text-autowise-blue" />
        <span>Année {car.year}</span>
      </div>
      <div className="flex items-center">
        <CarIcon className="h-5 w-5 mr-2 text-autowise-blue" />
        <span>Boîte {car.transmission}</span>
      </div>
      <div className="flex items-center">
        <MapPin className="h-5 w-5 mr-2 text-autowise-blue" />
        <span>Tunis</span>
      </div>
      <div className="flex items-center">
        <Clock className="h-5 w-5 mr-2 text-autowise-blue" />
        {car.availability?.availableDates && car.availability.availableDates.length > 0 ? (
          <span className="font-semibold text-green-700">
            Disponible du {new Date(car.availability.availableDates[0].startDate).toLocaleDateString()} au {new Date(car.availability.availableDates[0].endDate).toLocaleDateString()}
          </span>
        ) : (
          <span>Disponible</span>
        )}
      </div>
    </div>
  );
}
