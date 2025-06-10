import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EnhancedCarCard } from "@/components/EnhancedCarCard";
import { CarFilter } from "@/components/CarFilter";
import { Car } from "@/lib/types";
import { carService } from "@/services/carService";
import { Search } from "lucide-react";

export default function CarList() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const carsData = await carService.getAllCars();
        setCars(carsData);
        setFilteredCars(carsData);
      } catch (err) {
        console.error("Error fetching cars:", err);
        setError("Failed to load cars. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleFilterChange = async (filters: {
    brand?: string;
    hasAC?: boolean;
    driverAvailable?: boolean;
    minPrice?: number;
    maxPrice?: number;
    category?: string;
    dateRange?: {
      startDate: string;
      endDate: string;
    };
  }) => {
    setLoading(true);
    try {
      const convertedFilters = {
        ...filters,
        dateRange: filters.dateRange
          ? {
              from: new Date(filters.dateRange.startDate),
              to: new Date(filters.dateRange.endDate),
            }
          : undefined,
      };
      const filteredCars = await carService.searchCars(convertedFilters);
      setFilteredCars(filteredCars);
    } catch (err) {
      console.error("Error filtering cars:", err);
      setError("Failed to apply filters. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (!value.trim()) {
      setFilteredCars(cars);
      return;
    }

    const results = cars.filter(
      (car) =>
        car.brand.toLowerCase().includes(value) ||
        car.model.toLowerCase().includes(value) ||
        car.category.toLowerCase().includes(value) ||
        car.location.toLowerCase().includes(value)
    );
    setFilteredCars(results);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-3xl font-bold mb-2 text-autowise-navy">Nos véhicules</h1>
          <p className="text-gray-600 mb-8">
            Explorez notre flotte et trouvez le véhicule parfait pour vos besoins
          </p>

          {/* Search Input */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Rechercher par marque, modèle, catégorie ou lieu..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-3 pr-10 border rounded-lg focus:ring-2 focus:ring-autowise-blue focus:border-transparent"
            />
            <Search className="absolute right-3 top-3 text-gray-400" />
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
              <p>{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filter Sidebar */}
            <div className="lg:col-span-1">
              <CarFilter onFilter={handleFilterChange} />
            </div>

            {/* Car List */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-lg shadow-md h-80 animate-pulse">
                      <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredCars.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">Aucun véhicule trouvé</h3>
                  <p className="text-gray-500">
                    Aucun véhicule ne correspond à vos critères. Essayez de modifier vos filtres.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {filteredCars.map((car) => (
                    <EnhancedCarCard key={car.id} car={car} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}