import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Car } from "@/lib/types";
import { carService } from "@/services/carService";
import { Edit, Trash, Plus, Search, Upload, X, Image } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";

export default function AdminCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [availabilityState, setAvailabilityState] = useState<{ [carId: string]: boolean }>({});
  
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: 2023,
    category: "standard" as "économique" | "standard" | "premium" | "luxe" | "utilitaire",
    dailyPrice: 100,
    transmission: "automatique" as "manuel" | "automatique",
    fuelType: "essence" as "essence" | "diesel" | "électrique" | "hybride",
    hasAC: true,
    seats: 5,
    driverAvailable: false,
    hasGPS: false,
    childSeatAvailable: false,
    description: "",
    features: ["Climatisation"],
    location: "Tunis Centre",
    availabilityPeriod: { from: undefined, to: undefined } as { from: Date | undefined; to: Date | undefined }
  });

  useEffect(() => {
    const loadCars = async () => {
      setLoading(true);
      try {
        const data = await carService.getAllCars();
        setCars(data);
        setFilteredCars(data);
      } catch (error) {
        console.error("Error loading cars:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les véhicules",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = cars.filter(
        car =>
          car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCars(filtered);
    } else {
      setFilteredCars(cars);
    }
  }, [searchTerm, cars]);

  useEffect(() => {
    // Initialiser l'état local de disponibilité à partir des données chargées
    if (cars.length > 0) {
      const initialAvailability: { [carId: string]: boolean } = {};
      cars.forEach(car => {
        initialAvailability[car.id] = car.availability?.available ?? true;
      });
      setAvailabilityState(initialAvailability);
    }
  }, [cars]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleAvailabilityPeriodChange = (range: { from?: Date; to?: Date }) => {
    setFormData(prev => ({
      ...prev,
      availabilityPeriod: range
    }));
  };

  const openEditDialog = (car: Car) => {
    let from: Date | undefined = undefined;
    let to: Date | undefined = undefined;
    if (car.availability?.availableDates && car.availability.availableDates.length > 0) {
      const range = car.availability.availableDates[0];
      from = range.startDate ? new Date(range.startDate) : undefined;
      to = range.endDate ? new Date(range.endDate) : undefined;
    }
    setSelectedCar(car);
    setFormData({
      brand: car.brand,
      model: car.model,
      year: car.year,
      category: car.category,
      dailyPrice: car.dailyPrice,
      transmission: car.transmission,
      fuelType: car.fuelType,
      hasAC: car.hasAC,
      seats: car.seats,
      driverAvailable: car.driverAvailable,
      hasGPS: car.hasGPS,
      childSeatAvailable: car.childSeatAvailable,
      description: car.description,
      features: car.features || [],
      location: car.location || "Tunis Centre",
      availabilityPeriod: { from, to }
    });
    setImagePreviewUrls(car.images || []);
    setUploadedImages([]);
    setShowEditDialog(true);
  };

  const openAddDialog = () => {
    setSelectedCar(null);
    setFormData({
      brand: "",
      model: "",
      year: 2023,
      category: "standard" as "économique" | "standard" | "premium" | "luxe" | "utilitaire",
      dailyPrice: 100,
      transmission: "automatique" as "manuel" | "automatique",
      fuelType: "essence" as "essence" | "diesel" | "électrique" | "hybride",
      hasAC: true,
      seats: 5,
      driverAvailable: false,
      hasGPS: false,
      childSeatAvailable: false,
      description: "",
      features: ["Climatisation"],
      location: "Tunis Centre",
      availabilityPeriod: { from: undefined, to: undefined }
    });
    setImagePreviewUrls([]);
    setUploadedImages([]);
    setShowAddDialog(true);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles = Array.from(event.target.files);
      
      // Créer des URL pour la prévisualisation
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      
      setUploadedImages(prev => [...prev, ...newFiles]);
      setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const handleRemoveImage = (index: number) => {
    // Si c'est une nouvelle image (uploadée pendant cette session)
    if (index >= (selectedCar?.images.length || 0)) {
      const newUploadedImages = [...uploadedImages];
      const adjustedIndex = index - (selectedCar?.images.length || 0);
      newUploadedImages.splice(adjustedIndex, 1);
      setUploadedImages(newUploadedImages);
    }
    
    // Mettre à jour les URLs de prévisualisation
    const newPreviewUrls = [...imagePreviewUrls];
    newPreviewUrls.splice(index, 1);
    setImagePreviewUrls(newPreviewUrls);
  };

  const handleAddFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, ""]
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  };

  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (!formData.availabilityPeriod.from || !formData.availabilityPeriod.to) {
        toast({
          variant: "destructive",
          title: "Période requise",
          description: "Veuillez sélectionner une période de disponibilité."
        });
        setSubmitting(false);
        return;
      }
      const availability = {
        available: true,
        availableDates: [
          {
            startDate: formData.availabilityPeriod.from.toISOString(),
            endDate: formData.availabilityPeriod.to.toISOString()
          }
        ]
      };
      if (selectedCar) {
        // Mode édition
        const typedFormData = {
          ...formData,
          category: formData.category as "économique" | "standard" | "premium" | "luxe" | "utilitaire",
          transmission: formData.transmission as "manuel" | "automatique",
          fuelType: formData.fuelType as "essence" | "diesel" | "électrique" | "hybride",
          availability
        };
        const updatedCar = await carService.updateCar(selectedCar.id, typedFormData, uploadedImages);
        setCars(prev => prev.map(car => car.id === selectedCar.id ? updatedCar : car));
        toast({
          title: "Véhicule modifié",
          description: `${formData.brand} ${formData.model} a été mis à jour avec succès.`
        });
        setShowEditDialog(false);
      } else {
        // Mode ajout
        if (uploadedImages.length === 0) {
          toast({
            variant: "destructive",
            title: "Images requises",
            description: "Veuillez ajouter au moins une image pour le véhicule."
          });
          setSubmitting(false);
          return;
        }
        const typedFormData = {
          ...formData,
          category: formData.category as "économique" | "standard" | "premium" | "luxe" | "utilitaire",
          transmission: formData.transmission as "manuel" | "automatique",
          fuelType: formData.fuelType as "essence" | "diesel" | "électrique" | "hybride",
          availability
        };
        const newCar = await carService.addCar(typedFormData, uploadedImages);
        setCars(prev => [...prev, newCar]);
        toast({
          title: "Véhicule ajouté",
          description: `${formData.brand} ${formData.model} a été ajouté avec succès.`
        });
        setShowAddDialog(false);
      }
      setFilteredCars(cars);
    } catch (error) {
      console.error("Error submitting car:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du véhicule."
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (carId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ?")) {
      try {
        // Dans une vraie application, nous ferions un appel API ici
        const updatedCars = cars.filter(car => car.id !== carId);
        setCars(updatedCars);
        setFilteredCars(updatedCars);

        toast({
          title: "Véhicule supprimé",
          description: "Le véhicule a été supprimé avec succès."
        });
      } catch (error) {
        console.error("Error deleting car:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la suppression du véhicule."
        });
      }
    }
  };

  const handleToggleAvailability = (carId: string) => {
    setAvailabilityState(prev => {
      const newState = { ...prev, [carId]: !prev[carId] };
      // Toast contextuel
      toast({
        title: newState[carId] ? "La voiture est maintenant disponible." : "La voiture est maintenant indisponible.",
        variant: newState[carId] ? "default" : "destructive",
      });
      return newState;
    });
  };

  const CarForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="brand" className="mb-1 block">Marque</Label>
          <Input 
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="model" className="mb-1 block">Modèle</Label>
          <Input 
            id="model"
            name="model"
            value={formData.model}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="year" className="mb-1 block">Année</Label>
          <Input 
            id="year"
            name="year"
            type="number"
            value={formData.year}
            onChange={handleInputChange}
            min={1990}
            max={2030}
            required
          />
        </div>

        <div>
          <Label htmlFor="dailyPrice" className="mb-1 block">Prix journalier (TND)</Label>
          <Input 
            id="dailyPrice"
            name="dailyPrice"
            type="number"
            value={formData.dailyPrice}
            onChange={handleInputChange}
            min={0}
            required
          />
        </div>

        <div>
          <Label htmlFor="category" className="mb-1 block">Catégorie</Label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="économique">Économique</option>
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
            <option value="luxe">Luxe</option>
            <option value="utilitaire">Utilitaire</option>
          </select>
        </div>

        <div>
          <Label htmlFor="transmission" className="mb-1 block">Transmission</Label>
          <select
            id="transmission"
            name="transmission"
            value={formData.transmission}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="manuel">Manuelle</option>
            <option value="automatique">Automatique</option>
          </select>
        </div>

        <div>
          <Label htmlFor="fuelType" className="mb-1 block">Type de carburant</Label>
          <select
            id="fuelType"
            name="fuelType"
            value={formData.fuelType}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="essence">Essence</option>
            <option value="diesel">Diesel</option>
            <option value="électrique">Électrique</option>
            <option value="hybride">Hybride</option>
          </select>
        </div>

        <div>
          <Label htmlFor="seats" className="mb-1 block">Nombre de places</Label>
          <Input 
            id="seats"
            name="seats"
            type="number"
            value={formData.seats}
            onChange={handleInputChange}
            min={1}
            max={9}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="location" className="mb-1 block">Emplacement</Label>
          <Input 
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="description" className="mb-1 block">Description</Label>
        <Textarea 
          id="description" 
          name="description" 
          value={formData.description} 
          onChange={handleInputChange} 
          rows={3}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label className="mb-1 block">Caractéristiques</Label>
        {formData.features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input 
              value={feature} 
              onChange={(e) => handleFeatureChange(index, e.target.value)} 
              placeholder="Caractéristique"
              className="flex-1"
            />
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              onClick={() => handleRemoveFeature(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={handleAddFeature}
        >
          Ajouter une caractéristique
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="hasAC" 
            checked={formData.hasAC} 
            onCheckedChange={(checked) => handleCheckboxChange("hasAC", checked === true)}
          />
          <Label htmlFor="hasAC">Climatisation</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="driverAvailable" 
            checked={formData.driverAvailable} 
            onCheckedChange={(checked) => handleCheckboxChange("driverAvailable", checked === true)}
          />
          <Label htmlFor="driverAvailable">Service de chauffeur</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="hasGPS" 
            checked={formData.hasGPS} 
            onCheckedChange={(checked) => handleCheckboxChange("hasGPS", checked === true)}
          />
          <Label htmlFor="hasGPS">GPS</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="childSeatAvailable" 
            checked={formData.childSeatAvailable} 
            onCheckedChange={(checked) => handleCheckboxChange("childSeatAvailable", checked === true)}
          />
          <Label htmlFor="childSeatAvailable">Siège enfant disponible</Label>
        </div>
      </div>

      <div>
        <Label className="mb-1 block">Disponibilité</Label>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full">
            <Calendar
              mode="range"
              selected={formData.availabilityPeriod}
              onSelect={handleAvailabilityPeriodChange}
              numberOfMonths={2}
              required
              disabled={{ before: new Date() }}
            />
          </div>
          <div className="flex flex-col gap-2 min-w-[180px]">
            <span className="text-sm text-gray-600">
              {formData.availabilityPeriod.from && formData.availabilityPeriod.to
                ? `Du ${formData.availabilityPeriod.from.toLocaleDateString()} au ${formData.availabilityPeriod.to.toLocaleDateString()}`
                : "Sélectionnez une période de disponibilité"}
            </span>
          </div>
        </div>
      </div>

      <div>
        <Label className="mb-1 block">Images du véhicule</Label>
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {imagePreviewUrls.map((url, index) => (
            <div key={index} className="relative group">
              <img 
                src={url} 
                alt={`Image ${index + 1}`} 
                className="w-full h-32 object-cover rounded-md"
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveImage(index)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          
          <div className="border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center h-32 cursor-pointer hover:bg-gray-50 transition-colors">
            <label htmlFor="imageUpload" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Ajouter une image</span>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                multiple
              />
            </label>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Formats acceptés: JPG, PNG, WEBP. Taille max: 5MB par image.
        </p>
      </div>

      <DialogFooter>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            setShowAddDialog(false);
            setShowEditDialog(false);
          }}
          disabled={submitting}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Traitement en cours..." : selectedCar ? "Mettre à jour" : "Ajouter"}
        </Button>
      </DialogFooter>
    </form>
  );

  return (
    <AdminLayout title="Gestion des véhicules" description="Gérez votre flotte de véhicules">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <Input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-9"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          <Button onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un véhicule
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-6">
            <p>Chargement des véhicules...</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Image</TableHead>
                  <TableHead>Marque</TableHead>
                  <TableHead>Modèle</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Prix (TND/j)</TableHead>
                  <TableHead>Disponibilité</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCars.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Aucun véhicule trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCars.map(car => (
                    <TableRow key={car.id}>
                      <TableCell>
                        {car.images && car.images.length > 0 ? (
                          <img 
                            src={car.images[0]} 
                            alt={`${car.brand} ${car.model}`} 
                            className="h-12 w-16 object-cover rounded-sm"
                          />
                        ) : (
                          <div className="h-12 w-16 bg-gray-200 rounded-sm flex items-center justify-center">
                            <Image className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{car.brand}</TableCell>
                      <TableCell>{car.model}</TableCell>
                      <TableCell>{car.category}</TableCell>
                      <TableCell>{car.dailyPrice} TND</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={!!availabilityState[car.id]}
                            onCheckedChange={() => handleToggleAvailability(car.id)}
                            className={
                              availabilityState[car.id]
                                ? "data-[state=checked]:bg-green-500"
                                : "data-[state=unchecked]:bg-gray-300"
                            }
                          />
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                              availabilityState[car.id]
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {availabilityState[car.id] ? (
                              <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" /></svg>
                            ) : (
                              <svg className="w-3 h-3 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" /></svg>
                            )}
                            {availabilityState[car.id] ? "Disponible" : "Indisponible"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(car)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(car.id)}>
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Dialogue d'ajout */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau véhicule</DialogTitle>
            <DialogDescription>Remplissez le formulaire pour ajouter un véhicule à la flotte.</DialogDescription>
          </DialogHeader>
          <CarForm />
        </DialogContent>
      </Dialog>

      {/* Dialogue de modification */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier un véhicule</DialogTitle>
            <DialogDescription>Modifiez les informations du véhicule sélectionné.</DialogDescription>
          </DialogHeader>
          <CarForm />
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
