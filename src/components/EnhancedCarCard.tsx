import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car as CarType } from "@/lib/types";
import {
  Calendar,
  User,
  Gauge,
  Car,
  Fuel,
  Snowflake,
  Heart,
} from "lucide-react";
import { useCarFavorite } from "@/hooks/useCarFavorite";

interface EnhancedCarCardProps {
  car: CarType;
}

export function EnhancedCarCard({ car }: EnhancedCarCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { isFavorite, handleToggleFavorite } = useCarFavorite(car.id);

  // Formater le prix
  const formatPrice = (price: number) => {
    return `${price} TND`;
  };

  // Définir l'image principale (première image ou image par défaut)
  const mainImage = car.images && car.images.length > 0
    ? car.images[0]
    : "/placeholder.svg";

  // Générer les tags en fonction des caractéristiques de la voiture
  const getTags = () => {
    const tags = [];

    if (car.hasAC) {
      tags.push("Climatisation");
    }

    if (car.driverAvailable) {
      tags.push("Avec chauffeur");
    }

    if (car.transmission === "automatique") {
      tags.push("Automatique");
    }

    return tags;
  };

  return (
    <Card
      className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 z-10 rounded-full bg-white/70 hover:bg-white ${
            isFavorite ? "text-red-500" : "text-gray-400"
          }`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleToggleFavorite();
          }}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
          <span className="sr-only">
            {isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          </span>
        </Button>

        <Link to={`/cars/${car.id}`} className="block group">
          {/* Image avec effet de zoom */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={mainImage}
              alt={`${car.brand} ${car.model}`}
              className={`w-full h-full object-cover transition-transform duration-500 ${
                isHovered ? "scale-110" : "scale-100"
              }`}
              loading="lazy"
            />
            
            {/* Badge de catégorie */}
            <Badge
              className="absolute top-3 left-3 bg-autowise-navy text-white"
              variant="secondary"
            >
              {car.category.charAt(0).toUpperCase() + car.category.slice(1)}
            </Badge>

            {/* Prix par jour - Nouveau badge */}
            <Badge className="absolute bottom-3 right-3 bg-autowise-blue text-white">
              {formatPrice(car.dailyPrice)}<span className="text-xs ml-1">/jour</span>
            </Badge>
          </div>
          {/* Contenu de la carte (en-tête, specs, tags, bouton) */}
          <CardContent className="p-4 flex flex-col flex-grow">
            {/* En-tête de la carte */}
            <div className="mb-3">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg">
                  {car.brand} {car.model}
                </h3>
              </div>
              <p className="text-sm text-gray-500">{car.year}</p>
            </div>

            {/* Caractéristiques principales */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-1" />
                <span>{car.seats} places</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Gauge className="h-4 w-4 mr-1" />
                <span>{car.transmission}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Fuel className="h-4 w-4 mr-1" />
                <span>{car.fuelType}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Car className="h-4 w-4 mr-1" />
                <span>{car.category}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {getTags().map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded"
                >
                  {tag === "Climatisation" && <Snowflake className="h-3 w-3 mr-1" />}
                  {tag}
                </span>
              ))}
            </div>

            {/* Bouton de détails (n'est plus un <Link> imbriqué) */}
            <div className="mt-auto pt-3 border-t flex justify-center">
              <span className="w-full text-center text-autowise-blue font-semibold group-hover:underline">
                Voir les détails
              </span>
            </div>
          </CardContent>
        </Link>
      </div>
    </Card>
  );
}
