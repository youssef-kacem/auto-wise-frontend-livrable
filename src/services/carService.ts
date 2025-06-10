import axios from 'axios';
import { Car } from '@/lib/types';

const API_URL = 'http://localhost:8000/api'; // Adjust to your Symfony server URL

export interface GetCarsParams {
  page?: number;
}

export interface CarListResponse {
  member: any[];
  totalItems: number;
  view?: any;
  search?: any;
}

export const carService = {
  // Fetch all cars
  getAllCars: async (): Promise<Car[]> => {
    try {
      const token = localStorage.getItem('autowise-token'); // Correction ici
      const response = await axios.get(`${API_URL}/voitures`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });
      return response.data['hydra:member'].map((car: any) => ({
        id: car.id,
        brand: car.brand,
        model: car.model,
        year: car.year,
        pricePerDay: car.pricePerDay,
        category: car.category,
        transmission: car.transmission,
        fuelType: car.fuelType,
        location: car.location,
        description: car.description,
        features: car.features,
        availabilityFrom: car.availabilityFrom,
        availabilityTo: car.availabilityTo,
        images: car.images,
      }));
    } catch (error) {
      console.error('Error fetching all cars:', error);
      throw error; // Re-throw to allow components to handle the error
    }
  },

  // Search cars with filters
  searchCars: async (filters: {
    brand?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    dateRange?: {
      from: Date;
      to: Date;
    };
  }): Promise<Car[]> => {
    try {
      const params = new URLSearchParams();

      if (filters.brand) params.append('brand', filters.brand);
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('pricePerDay[>=]', filters.minPrice.toString());
      if (filters.maxPrice) params.append('pricePerDay[<=]', filters.maxPrice.toString());
      if (filters.dateRange) {
        params.append('availabilityFrom[<=]', filters.dateRange.from.toISOString().split('T')[0]);
        params.append('availabilityTo[>=]', filters.dateRange.to.toISOString().split('T')[0]);
      }

      const token = localStorage.getItem('autowise-token'); // Correction ici
      const response = await axios.get(`${API_URL}/voitures`, {
        params,
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      });
      return response.data['hydra:member'].map((car: any) => ({
        id: car.id,
        brand: car.brand,
        model: car.model,
        year: car.year,
        pricePerDay: car.pricePerDay,
        category: car.category,
        transmission: car.transmission,
        fuelType: car.fuelType,
        location: car.location,
        description: car.description,
        features: car.features,
        availabilityFrom: car.availabilityFrom,
        availabilityTo: car.availabilityTo,
        images: car.images,
      }));
    } catch (error) {
      console.error('Error searching cars:', error);
      throw error; // Re-throw to allow components to handle the error
    }
  },

  // Fetch car by ID
  getCarById: async (id: string): Promise<Car | undefined> => {
    try {
      const token = localStorage.getItem('autowise-token'); // Correction ici
      const response = await axios.get(`${API_URL}/voitures/${id}`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      });
      const car = response.data;
      return {
        id: car.id,
        brand: car.brand,
        model: car.model,
        year: car.year,
        pricePerDay: car.pricePerDay,
        category: car.category,
        transmission: car.transmission,
        fuelType: car.fuelType,
        location: car.location,
        description: car.description,
        features: car.features,
        availabilityFrom: car.availabilityFrom,
        availabilityTo: car.availabilityTo,
        images: car.images,
      };
    } catch (error) {
      console.error(`Error fetching car with id ${id}:`, error);
      throw error; // Re-throw to allow components to handle the error
    }
  },

  async getCars({ page = 1 }: GetCarsParams = {}): Promise<CarListResponse> {
    const params = new URLSearchParams();
    if (page) params.append('page', String(page));
    const url = `${API_URL}/api/voitures?${params.toString()}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/ld+json',
      },
    });
    if (!response.ok) {
      throw new Error("Impossible de récupérer la liste des voitures.");
    }
    return response.json();
  },
};