import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { favoriteService } from "@/services/favoriteService";
import { carService } from "@/services/carService";
import { Car } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { History, Car as CarIcon, Eye, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FavoritesListProps {
  isHistory?: boolean;
}

export function FavoritesList({ isHistory = false }: FavoritesListProps) {
  const [favorites, setFavorites] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  // Chargement des favoris
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const cars = isHistory 
          ? await favoriteService.getRecentlyViewedCars(carService)
          : await favoriteService.getFavoriteCars(carService);
        setFavorites(cars);
      } catch (error) {
        console.error(`Erreur lors du chargement des ${isHistory ? "véhicules récents" : "favoris"}:`, error);
        toast({
          title: "Erreur",
          description: `Impossible de charger ${isHistory ? "l'historique des véhicules" : "vos véhicules favoris"}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isHistory]);

  // Fonction pour retirer un favori
  const handleRemoveFavorite = (carId: string) => {
    favoriteService.removeFavorite(carId);
    setFavorites(favorites.filter(car => car.id !== carId));
    toast({
      description: "Véhicule retiré de vos favoris"
    });
  };

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{isHistory ? "Historique des véhicules" : "Mes favoris"}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-0">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex justify-between mt-4">
                    <Skeleton className="h-10 w-20" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Affichage si aucun favori
  if (!Array.isArray(favorites) || favorites.length === 0) {
    return (
      <Card className="text-center p-8">
        <CardHeader>
          <CardTitle>{isHistory ? "Historique des véhicules" : "Mes favoris"}</CardTitle>
          <CardDescription>
            {isHistory 
              ? "Vous n'avez pas encore consulté de véhicules"
              : "Vous n'avez pas encore de véhicule favori"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-8">
          {isHistory ? (
            <History className="h-16 w-16 text-gray-300 mb-4" />
          ) : (
            <History className="h-16 w-16 text-gray-300 mb-4" />
          )}
          <p className="text-center text-gray-500 mb-6">
            {isHistory 
              ? "Votre historique de consultation de véhicules est vide."
              : "Vous n'avez pas encore ajouté de véhicule à vos favoris."
            }
            <br />
            Explorez notre sélection de véhicules !
          </p>
          <Button asChild>
            <Link to="/cars">Voir nos véhicules</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Affichage des favoris ou de l'historique
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{isHistory ? "Historique des véhicules" : "Mes favoris"}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(favorites) && favorites.map((car) => (
          <Card key={car.id} className="overflow-hidden">
            <CardContent className="p-0">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={car.images?.[0] || "/placeholder.svg"}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 right-2">
                  {car.dailyPrice} TND/jour
                </Badge>
              </div>
              
              {/* Informations */}
              <div className="p-4">
                <h3 className="font-semibold text-lg">{car.brand} {car.model}</h3>
                <p className="text-sm text-gray-500 mb-4">{car.year} • {car.transmission} • {car.fuelType}</p>
                
                <div className="flex justify-between">
                  {isHistory ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Consulté récemment
                    </Button>
                  ) : (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveFavorite(car.id);
                      }}
                    >
                      <History className="h-4 w-4 mr-2" />
                      Retirer
                    </Button>
                  )}
                  
                  <Button 
                    variant="default" 
                    size="sm" 
                    asChild
                  >
                    <Link to={`/cars/${car.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      Voir détails
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
