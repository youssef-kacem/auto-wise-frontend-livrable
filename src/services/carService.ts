import { Car } from "@/lib/types";
import { addDays, subDays } from "date-fns";

// Mock car data
const mockCars: Car[] = [
  {
    id: "car-1",
    brand: "BMW",
    model: "Série 5",
    year: 2022,
    category: "luxe",
    seats: 5,
    dailyPrice: 250,
    transmission: "automatique",
    fuelType: "essence",
    hasAC: true,
    location: "Tunis Centre",
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1523676060187-f55189a71f5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
    ],
    features: ["Bluetooth", "Navigation GPS", "Sièges en cuir", "Toit ouvrant", "Caméra de recul"],
    availability: {
      available: true
    },
    description: "La BMW Série 5 est une berline de luxe offrant une combinaison parfaite de confort, de technologie et de performances.",
    driverAvailable: true,
    hasGPS: true,
    childSeatAvailable: true,
    reviews: [
      { id: "rev-1", userId: "user-1", rating: 5, comment: "Voiture exceptionnelle, très confortable et puissante.", date: "2023-05-15" },
      { id: "rev-2", userId: "user-3", rating: 4, comment: "Très bonne expérience, légèrement chère.", date: "2023-04-22" }
    ]
  },
  {
    id: "car-2",
    brand: "Mercedes-Benz",
    model: "Classe C",
    year: 2021,
    category: "luxe",
    seats: 5,
    dailyPrice: 220,
    transmission: "automatique",
    fuelType: "diesel",
    hasAC: true,
    location: "Tunis Carthage",
    rating: 4.7,
    images: [
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2325&q=80",
      "https://images.unsplash.com/photo-1602777924001-a47d5be9f4bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2274&q=80",
      "https://images.unsplash.com/photo-1603053581775-86a2e9f25a60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
    ],
    features: ["Audio Burmester", "Écran tactile", "Sièges chauffants", "Jantes en alliage", "Système Start/Stop"],
    availability: {
      available: true
    },
    description: "La Mercedes-Benz Classe C offre un niveau de luxe et de confort exceptionnel avec une finition haut de gamme et des technologies de pointe.",
    driverAvailable: true,
    hasGPS: true,
    childSeatAvailable: true,
    reviews: [
      { id: "rev-3", userId: "user-2", rating: 5, comment: "Service impeccable et voiture en parfait état.", date: "2023-05-02" }
    ]
  },
  {
    id: "car-3",
    brand: "Audi",
    model: "A6",
    year: 2022,
    category: "luxe",
    seats: 5,
    dailyPrice: 240,
    transmission: "automatique",
    fuelType: "diesel",
    hasAC: true,
    location: "Tunis Centre",
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1606664515655-94b9605b99d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1606664466509-6bc123a65ce3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
    ],
    features: ["Bang & Olufsen Premium Sound", "Virtual Cockpit", "Quattro AWD", "Matrix LED", "Régulateur adaptatif"],
    availability: {
      available: true
    },
    description: "L'Audi A6 est une berline de luxe allemande qui combine élégance, technologie de pointe et performances exceptionnelles.",
    driverAvailable: true,
    hasGPS: true,
    childSeatAvailable: true,
    reviews: [
      { id: "rev-4", userId: "user-4", rating: 5, comment: "Experience incroyable, voiture magnifique.", date: "2023-04-18" },
      { id: "rev-5", userId: "user-5", rating: 5, comment: "Parfait pour un voyage d'affaires.", date: "2023-03-30" }
    ]
  },
  {
    id: "car-4",
    brand: "Volkswagen",
    model: "Golf 8",
    year: 2021,
    category: "standard",
    seats: 5,
    dailyPrice: 120,
    transmission: "manuel",
    fuelType: "essence",
    hasAC: true,
    location: "Tunis Sud",
    rating: 4.5,
    images: [
      "https://images.unsplash.com/photo-1559416523-140ddc3d238c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2391&q=80",
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
    ],
    features: ["Apple CarPlay/Android Auto", "Climatisation automatique", "Capteurs de stationnement", "Bluetooth", "Phares LED"],
    availability: {
      available: true
    },
    description: "La Volkswagen Golf 8 est une compacte polyvalente, idéale pour la ville comme pour les longs trajets, combinant confort et économie de carburant.",
    driverAvailable: false,
    hasGPS: true,
    childSeatAvailable: true,
    reviews: [
      { id: "rev-6", userId: "user-6", rating: 4, comment: "Bonne voiture pour la ville, économique.", date: "2023-05-10" }
    ]
  },
  {
    id: "car-5",
    brand: "Toyota",
    model: "Corolla",
    year: 2022,
    category: "standard",
    seats: 5,
    dailyPrice: 110,
    transmission: "automatique",
    fuelType: "hybride",
    hasAC: true,
    location: "Tunis Nord",
    rating: 4.6,
    images: [
      "https://images.unsplash.com/photo-1623869675781-80aa31012a5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2274&q=80",
      "https://images.unsplash.com/photo-1621007690695-35edc18df1e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2274&q=80"
    ],
    features: ["Système hybride", "Caméra de recul", "Toyota Safety Sense", "Écran tactile 8 pouces", "Régulateur de vitesse adaptatif"],
    availability: {
      available: true
    },
    description: "La Toyota Corolla Hybride offre une conduite économique et respectueuse de l'environnement, sans compromis sur le confort et la fiabilité.",
    driverAvailable: false,
    hasGPS: true,
    childSeatAvailable: true,
    reviews: [
      { id: "rev-7", userId: "user-2", rating: 5, comment: "Très économique et confortable.", date: "2023-04-25" },
      { id: "rev-8", userId: "user-7", rating: 4, comment: "Bonne voiture, silencieuse en mode électrique.", date: "2023-03-15" }
    ]
  },
  {
    id: "car-6",
    brand: "Renault",
    model: "Clio 5",
    year: 2021,
    category: "économique",
    seats: 5,
    dailyPrice: 90,
    transmission: "manuel",
    fuelType: "essence",
    hasAC: true,
    location: "Tunis Centre",
    rating: 4.4,
    images: [
      "https://images.unsplash.com/photo-1545974452-caa213f76132?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
    ],
    features: ["Écran tactile 7 pouces", "Navigation", "Bluetooth", "Régulateur de vitesse", "Climatisation"],
    availability: {
      available: true
    },
    description: "La Renault Clio 5 est une citadine moderne, agile et économique, parfaite pour naviguer en ville et se garer facilement.",
    driverAvailable: false,
    hasGPS: false,
    childSeatAvailable: true,
    reviews: [
      { id: "rev-9", userId: "user-8", rating: 4, comment: "Parfaite pour la ville, facile à garer.", date: "2023-05-05" }
    ]
  },
  {
    id: "car-7",
    brand: "Peugeot",
    model: "208",
    year: 2022,
    category: "économique",
    seats: 5,
    dailyPrice: 95,
    transmission: "manuel",
    fuelType: "essence",
    hasAC: true,
    location: "Tunis Sud",
    rating: 4.3,
    images: [
      "https://images.unsplash.com/photo-1600705809084-e2a274e60bc0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2274&q=80",
      "https://images.unsplash.com/photo-1666000143062-a03ef881bb5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2274&q=80"
    ],
    features: ["i-Cockpit", "Écran tactile 7 pouces", "Apple CarPlay/Android Auto", "Aide au stationnement arrière", "Climatisation automatique"],
    availability: {
      available: true
    },
    description: "La Peugeot 208 est une citadine élégante avec un design distinctif et des technologies modernes pour une conduite agréable au quotidien.",
    driverAvailable: false,
    hasGPS: false,
    childSeatAvailable: true,
    reviews: [
      { id: "rev-10", userId: "user-9", rating: 4, comment: "Design intérieur superbe, bonne tenue de route.", date: "2023-04-12" },
      { id: "rev-11", userId: "user-3", rating: 5, comment: "Très économique, parfaite pour la ville.", date: "2023-03-28" }
    ]
  },
  {
    id: "car-8",
    brand: "Range Rover",
    model: "Evoque",
    year: 2021,
    category: "luxe",
    seats: 5,
    dailyPrice: 280,
    transmission: "automatique",
    fuelType: "diesel",
    hasAC: true,
    location: "Tunis Nord",
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1549061872-9a28a5a462f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2436&q=80"
    ],
    features: ["Système Terrain Response", "Intérieur en cuir", "Toit panoramique", "Système audio Meridian", "Caméras 360°"],
    availability: {
      available: true
    },
    description: "Le Range Rover Evoque combine luxe et capacités tout-terrain dans un SUV compact au design élégant et distinctif.",
    driverAvailable: true,
    hasGPS: true,
    childSeatAvailable: true,
    reviews: [
      { id: "rev-12", userId: "user-2", rating: 5, comment: "SUV luxueux, parfait pour un week-end.", date: "2023-05-08" },
      { id: "rev-13", userId: "user-5", rating: 5, comment: "Confort exceptionnel, très satisfait.", date: "2023-04-20" }
    ]
  },
  {
    id: "car-9",
    brand: "Citroën",
    model: "C3",
    year: 2021,
    category: "économique",
    seats: 5,
    dailyPrice: 85,
    transmission: "manuel",
    fuelType: "essence",
    hasAC: true,
    location: "Tunis Centre",
    rating: 4.2,
    images: [
      "https://images.unsplash.com/photo-1589181942131-52d578632fdc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2274&q=80",
      "https://images.unsplash.com/photo-1545044846-351ba102b6d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2274&q=80"
    ],
    features: ["Connectivité Bluetooth", "Climatisation", "Aide au stationnement arrière", "Régulateur de vitesse", "Limiteur de vitesse"],
    availability: {
      available: true
    },
    description: "La Citroën C3 est une citadine au style unique, offrant un excellent confort de conduite et une bonne économie de carburant.",
    driverAvailable: false,
    hasGPS: false,
    childSeatAvailable: true,
    reviews: [
      { id: "rev-14", userId: "user-7", rating: 4, comment: "Voiture confortable avec une bonne suspension.", date: "2023-04-30" }
    ]
  },
  {
    id: "car-10",
    brand: "Ford",
    model: "Transit",
    year: 2020,
    category: "utilitaire",
    seats: 3,
    dailyPrice: 150,
    transmission: "manuel",
    fuelType: "diesel",
    hasAC: true,
    location: "Tunis Sud",
    rating: 4.4,
    images: [
      "https://images.unsplash.com/photo-1609140098611-57646f4a293f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
    ],
    features: ["Grand espace de chargement", "Bluetooth", "Climatisation", "Aide au stationnement", "Régulateur de vitesse"],
    availability: {
      available: true
    },
    description: "Le Ford Transit est un utilitaire spacieux et fiable, parfait pour les déménagements ou le transport de marchandises volumineuses.",
    driverAvailable: false,
    hasGPS: true,
    childSeatAvailable: false,
    reviews: [
      { id: "rev-15", userId: "user-10", rating: 5, comment: "Parfait pour mon déménagement, très spacieux.", date: "2023-05-02" },
      { id: "rev-16", userId: "user-4", rating: 4, comment: "Bon rapport qualité/prix pour un utilitaire.", date: "2023-04-15" }
    ]
  }
];

// Service pour les voitures
export const carService = {
  // Récupérer toutes les voitures
  getAllCars: async (): Promise<Car[]> => {
    // Simuler une requête à l'API
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockCars;
  },
  
  // Récupérer une voiture par son ID
  getCarById: async (id: string) => {
    // Simuler une requête à l'API
    await new Promise(resolve => setTimeout(resolve, 800));
    const car = mockCars.find(car => car.id === id);
    return car;
  },
  
  // Rechercher des voitures avec des filtres
  searchCars: async (filters: {
    brand?: string;
    hasAC?: boolean;
    driverAvailable?: boolean;
    minPrice?: number;
    maxPrice?: number;
    category?: string;
    dateRange?: {
      from: Date;
      to: Date;
    };
  }): Promise<Car[]> => {
    // Simuler une requête à l'API
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return mockCars.filter((car) => {
      // Brand filter
      if (filters.brand && !car.brand.toLowerCase().includes(filters.brand.toLowerCase())) {
        return false;
      }
      
      // AC filter
      if (filters.hasAC !== undefined && car.hasAC !== filters.hasAC) {
        return false;
      }
      
      // Driver filter
      if (filters.driverAvailable !== undefined && car.driverAvailable !== filters.driverAvailable) {
        return false;
      }
      
      // Min price filter
      if (filters.minPrice !== undefined && car.dailyPrice < filters.minPrice) {
        return false;
      }
      
      // Max price filter
      if (filters.maxPrice !== undefined && car.dailyPrice > filters.maxPrice) {
        return false;
      }
      
      // Category filter
      if (filters.category && car.category !== filters.category) {
        return false;
      }
      
      // Availability filter
      if (filters.dateRange && car.availability) {
        // Check if the car is generally available
        if (!car.availability.available) {
          return false;
        }
        
        // Si le véhicule a des périodes de disponibilité définies, il faut que la période demandée soit entièrement incluse dans au moins une de ces périodes
        if (car.availability.availableDates && car.availability.availableDates.length > 0) {
          const requestedFrom = filters.dateRange.from;
          const requestedTo = filters.dateRange.to;
          const isFullyIncluded = car.availability.availableDates.some(range => {
            const start = new Date(range.startDate);
            const end = new Date(range.endDate);
            return start <= requestedFrom && end >= requestedTo;
          });
          return isFullyIncluded;
        }
        
        // No specific date restrictions, so the car is available
        return true;
      }
      
      return true;
    });
  },
  
  // Récupérer toutes les marques de voitures
  getBrands: async () => {
    // Simuler une requête à l'API
    await new Promise(resolve => setTimeout(resolve, 500));
    const brands = [...new Set(mockCars.map(car => car.brand))];
    return brands;
  },
  
  // Récupérer la gamme de prix
  getPriceRange: async () => {
    // Simuler une requête à l'API
    await new Promise(resolve => setTimeout(resolve, 500));
    const prices = mockCars.map(car => car.dailyPrice);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  },
  
  // Upload d'une image (simulé)
  uploadImage: async (file: File) => {
    // Simuler une requête à l'API pour l'upload de fichier
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Dans une vraie application, nous enverrions le fichier à un serveur
    // Ici, nous simulons une URL retournée
    const imageUrl = URL.createObjectURL(file);
    return imageUrl;
  },
  
  // Ajouter une nouvelle voiture (simulé)
  addCar: async (carData: Partial<Car>, images: File[]): Promise<Car> => {
    // Simuler une requête à l'API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate fake image URLs for uploaded images
    const imageUrls = images.map(
      (_, index) => `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/600/400`
    );
    
    // Create a new car object
    const newCar: Car = {
      id: `car-${mockCars.length + 1}`,
      brand: carData.brand || "",
      model: carData.model || "",
      year: carData.year || 2023,
      seats: carData.seats || 5,
      dailyPrice: carData.dailyPrice || 100,
      category: carData.category || "standard",
      transmission: carData.transmission || "automatique",
      fuelType: carData.fuelType || "essence",
      hasAC: carData.hasAC !== undefined ? carData.hasAC : true,
      location: carData.location || "Tunis Centre",
      images: imageUrls,
      features: carData.features || [],
      availability: {
        available: true
      },
      description: carData.description || "",
      driverAvailable: carData.driverAvailable !== undefined ? carData.driverAvailable : false,
      hasGPS: carData.hasGPS !== undefined ? carData.hasGPS : false,
      childSeatAvailable: carData.childSeatAvailable !== undefined ? carData.childSeatAvailable : false
    };
    
    // Add the new car to the mock database
    mockCars.push(newCar);
    
    return newCar;
  },
  
  // Mettre à jour une voiture existante (simulé)
  updateCar: async (id: string, carData: Partial<Car>, images: File[]): Promise<Car> => {
    // Simuler une requête à l'API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For simplicity, just return an updated car object
    // In a real app, this would update the database
    const carToUpdate = mockCars.find(car => car.id === id);
    
    if (!carToUpdate) {
      throw new Error("Car not found");
    }
    
    // Generate fake image URLs for new uploaded images
    const newImageUrls = images.map(
      (_, index) => `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/600/400`
    );
    
    // Update the car with new data
    const updatedCar: Car = {
      ...carToUpdate,
      ...carData,
      location: carData.location || carToUpdate.location,
      images: [...(carToUpdate.images || []), ...newImageUrls],
    };
    
    // Update the car in the mock database
    const index = mockCars.findIndex(car => car.id === id);
    if (index !== -1) {
      mockCars[index] = updatedCar;
    }
    
    return updatedCar;
  },
  
  // Supprimer une image d'une voiture (simulé)
  deleteCarImage: async (carId: string, imageIndex: number) => {
    // Simuler une requête à l'API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Chercher la voiture
    const carIndex = mockCars.findIndex(car => car.id === carId);
    
    if (carIndex === -1) {
      throw new Error("Voiture non trouvée");
    }
    
    if (imageIndex >= mockCars[carIndex].images.length || imageIndex < 0) {
      throw new Error("Image non trouvée");
    }
    
    // Copier le tableau d'images et supprimer l'image spécifiée
    const updatedImages = [...mockCars[carIndex].images];
    updatedImages.splice(imageIndex, 1);
    
    // Mettre à jour les images de la voiture
    const updatedCar = {
      ...mockCars[carIndex],
      images: updatedImages
    };
    
    // Retourner la voiture mise à jour
    return updatedCar;
  }
};
