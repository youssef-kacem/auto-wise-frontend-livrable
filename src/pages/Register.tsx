import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import FileUpload from "@/components/FileUpload";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    plainPassword: "",
    confirmPassword: "",
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nom || typeof formData.nom !== 'string' || !formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.prenom || typeof formData.prenom !== 'string' || !formData.prenom.trim()) newErrors.prenom = "Le prénom est requis";
    if (!formData.email || typeof formData.email !== 'string') newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Format d'email invalide";
    if (!formData.telephone || typeof formData.telephone !== 'string') newErrors.telephone = "Le numéro de téléphone est requis";
    else if (!/^\d{8}$/.test(formData.telephone)) newErrors.telephone = "Le numéro doit contenir 8 chiffres";
    if (!formData.plainPassword || typeof formData.plainPassword !== 'string') newErrors.plainPassword = "Le mot de passe est requis";
    else if (formData.plainPassword.length < 8) newErrors.plainPassword = "Au moins 8 caractères";
    if (formData.plainPassword !== formData.confirmPassword) newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setErrors({});
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      const success = await register(registerData);
      if (success) {
        setSuccessMessage("Inscription réussie ! Vérifiez votre email pour activer votre compte.");
        setFormData({
          nom: "",
          prenom: "",
          email: "",
          telephone: "",
          plainPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error: any) {
      // Gestion des violations API Platform
      if (error.violations) {
        const fieldErrors: Record<string, string> = {};
        error.violations.forEach((v: any) => {
          // API Platform retourne 'propertyPath' et 'message'
          fieldErrors[v.propertyPath] = v.message;
        });
        setErrors(fieldErrors);
      } else if (error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Erreur inconnue, veuillez réessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
            <div className="text-center mb-6">
              <img 
                src="/lovable-uploads/43daed69-9290-490b-99c3-7d35f12ec6d5.png" 
                alt="AutoWise" 
                className="h-10 mx-auto mb-4" 
              />
              <h1 className="text-2xl font-bold text-autowise-navy">Créer un compte</h1>
              <p className="text-gray-600 mt-1">
                Rejoignez AutoWise pour accéder à nos services de location
              </p>
            </div>

            {successMessage && <div className="text-green-600 mb-4">{successMessage}</div>}
            {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture */}
              <div className="flex justify-center">
                <FileUpload
                  onFileSelect={setProfilePicture}
                  label="Ajouter une photo"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom</Label>
                  <Input
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Nom"
                    required
                    disabled={isLoading}
                    className={errors.nom ? "border-red-500" : ""}
                  />
                  {errors.nom && (
                    <p className="text-red-500 text-xs mt-1">{errors.nom}</p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    placeholder="Prénom"
                    required
                    disabled={isLoading}
                    className={errors.prenom ? "border-red-500" : ""}
                  />
                  {errors.prenom && (
                    <p className="text-red-500 text-xs mt-1">{errors.prenom}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Adresse e-mail</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="exemple@email.com"
                    required
                    disabled={isLoading}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="telephone">Numéro de téléphone</Label>
                  <Input
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    placeholder="12345678"
                    required
                    disabled={isLoading}
                    className={errors.telephone ? "border-red-500" : ""}
                  />
                  {errors.telephone && (
                    <p className="text-red-500 text-xs mt-1">{errors.telephone}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="plainPassword">Mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="plainPassword"
                      name="plainPassword"
                      type={showPassword ? "text" : "password"}
                      value={formData.plainPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                      className={errors.plainPassword ? "border-red-500" : ""}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.plainPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.plainPassword}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                      className={errors.confirmPassword ? "border-red-500" : ""}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-autowise-blue hover:bg-autowise-navy"
                disabled={isLoading}
              >
                {isLoading ? "Création en cours..." : "Créer un compte"}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Vous avez déjà un compte ?{" "}
                  <Link to="/login" className="text-autowise-blue hover:underline">
                    Se connecter
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
